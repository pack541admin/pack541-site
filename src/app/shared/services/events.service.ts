import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EventEntry } from '../models/events.model';

@Injectable({ providedIn: 'root' })
export class EventsService {

  private http = inject(HttpClient);

  private readonly csvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuzNfF9dygfxPeuEnDvexUirEev_UcW97vumR65e9JBODrhur-m_vV3X26uSA2AQ/pub?output=csv';

  getEvents(): Observable<EventEntry[]> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(csv => this.parseCsv(csv))
    );
  }

  private parseCsv(csv: string): EventEntry[] {

    const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const headerIndex = lines.findIndex(l =>
      l.replace(/"/g, '').toLowerCase().startsWith('type')
    );
    if (headerIndex === -1) return [];

    return lines
      .slice(headerIndex + 1)
      .map(l => this.parseRow(l))
      .filter(cells => cells.length >= 1 && cells[0].length > 0)
      .map(cells => ({
        type: cells[0] ?? '',
        name: cells[1] ?? '',
        date: cells[2] ?? '',
        description: cells[3] ?? ''
      }));
  }

  private parseRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '"') {
        if (inQuotes && row[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }
}

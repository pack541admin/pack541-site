import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RoleEntry } from '../models/roles.model';


@Injectable({ providedIn: 'root' })
export class RolesService {

  private http = inject(HttpClient);

  private readonly csvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSNtumQwT5kQDUUgdDw1u68HU3s8h09-4o8zRYKYBaMswaVOWXcjLNklvYaDl2fJA/pub?output=csv';

  constructor() {

  }

  getRoles(): Observable<RoleEntry[]> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(csv => this.parseCsv(csv))
    );
  }

  private parseCsv(csv: string): RoleEntry[] {
  
    const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const headerIndex = lines.findIndex(l =>
      l.replace(/"/g, '').toLowerCase().startsWith('position title')
    );
    if (headerIndex === -1) return [];

    return lines
      .slice(headerIndex + 1)
      .map(l => this.parseRow(l))
      .filter(cells => cells.length >= 1 && cells[0].length > 0)
      .map(cells => ({
        position: cells[0] ?? '',
        name: cells[1] ?? '',
        type: cells[2] ?? '',
        email: cells[3] ?? '',
        notes: cells[4] ?? ''
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

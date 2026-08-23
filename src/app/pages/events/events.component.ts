import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EventEntry } from '../../shared/models/events.model';
import { EventsStore } from '../../shared/stores/events.store';

@Component({
  selector: 'app-events',
  imports: [DatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  private store = inject(EventsStore);

  upcomingEvents = this.store.upcomingEvents;
  isLoading = this.store.isLoading;
  hasError = this.store.error;

  private readonly typeMeta: { match: string; icon: string }[] = [
    { match: 'campout',  icon: '⛺' },
    { match: 'camp',     icon: '⛺' },
    { match: 'hike',     icon: '🥾' },
    { match: 'meeting',  icon: '📋' },
    { match: 'hangout',  icon: '🎉' },
    { match: 'service',  icon: '🤲' },
    { match: 'fundraiser', icon: '💰' },
    { match: 'popcorn',  icon: '🍿' },
    { match: 'ceremony', icon: '🏆' },
    { match: 'trip',     icon: '🚌' },
  ];

  iconFor(event: EventEntry): string {
    const lower = event.type.toLowerCase();
    for (const meta of this.typeMeta) {
      if (lower.includes(meta.match)) return meta.icon;
    }
    return '📅';
  }

  // Only format dates that include a specific day (e.g. "8/23/2026" or "2026-08-23") through
  // the DatePipe. Month-only entries (e.g. "August 2026") are shown as their raw text instead,
  // since formatting them would imply a specific day that isn't in the sheet.
  private readonly fullDatePattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$|^\d{4}-\d{2}-\d{2}$/;

  dateFor(event: EventEntry): Date | null {
    if (!event.date || !this.fullDatePattern.test(event.date.trim())) return null;
    const date = new Date(event.date);
    return isNaN(date.getTime()) ? null : date;
  }
}

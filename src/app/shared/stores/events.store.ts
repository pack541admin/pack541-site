import { computed, inject } from '@angular/core';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EventEntry } from '../models/events.model';
import { EventsService } from '../services/events.service';

interface EventsState {
  events: EventEntry[];
  isLoading: boolean;
  error: boolean;
}

const initialState: EventsState = {
  events: [],
  isLoading: false,
  error: false,
};

// Dates written as a specific day, e.g. "8/23/2026" or "2026-08-23".
const fullDatePattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$|^\d{4}-\d{2}-\d{2}$/;

function parseEventDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// An event is "past" once its specific day has ended, or — for month-only dates
// like "September 2026" — once its whole month has ended. Unparseable dates are
// never treated as past so they stay visible rather than silently disappearing.
function isPastEvent(value: string, now: Date): boolean {
  const date = parseEventDate(value);
  if (!date) return false;

  if (fullDatePattern.test(value.trim())) {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date.getTime() < todayStart.getTime();
  }

  const eventMonthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return eventMonthStart.getTime() < currentMonthStart.getTime();
}

export const EventsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Events happening today (or this month, for month-only dates) or later, soonest first.
    // Events with an unparseable/blank date are kept and sorted last.
    upcomingEvents: computed(() => {
      const now = new Date();
      return [...store.events()]
        .filter(e => !isPastEvent(e.date, now))
        .sort((a, b) => {
          const dateA = parseEventDate(a.date)?.getTime() ?? Infinity;
          const dateB = parseEventDate(b.date)?.getTime() ?? Infinity;
          return dateA - dateB;
        });
    }),
  })),
  withMethods((store) => {
    const eventsService = inject(EventsService);
    return {
      loadEvents: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: false })),
          switchMap(() =>
            eventsService.getEvents().pipe(
              tap(events => patchState(store, { events, isLoading: false })),
              catchError(() => {
                patchState(store, { error: true, isLoading: false });
                return EMPTY;
              })
            )
          )
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.loadEvents();
    },
  })
);

import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Fundraiser } from '../../shared/models/fundraising.model';
import { FundraisingStore } from '../../shared/stores/fundraising.store';
import { FlyerStore } from '../../shared/stores/flyer.store';
import { FlyerModalComponent } from '../../components/flyer-modal/flyer-modal.component';

/**
 * true  → the flyer pops up automatically when someone visits the Fundraising page
 *         (once per browser session), as long as a flyer exists and a fundraiser is active.
 * false → (default) the flyer only opens from the "View Flyer" buttons.
 * The flyer itself is public/images/fundraising/fundraising-flyer-active.(png|jpg|jpeg|gif|webp).
 */
const SHOW_FLYER_ON_PAGE_LOAD = false;
const FLYER_DISMISSED_KEY = 'pack541-fundraising-flyer-dismissed';

@Component({
  selector: 'app-fundraising',
  imports: [RouterLink, CurrencyPipe, DatePipe, FlyerModalComponent],
  templateUrl: './fundraising.component.html',
  styleUrl: './fundraising.component.scss'
})
export class FundraisingComponent {
  private store = inject(FundraisingStore);

  flyerSrc = inject(FlyerStore).flyerSrc;
  showFlyer = signal(false);

  constructor() {
    if (SHOW_FLYER_ON_PAGE_LOAD && !this.readDismissed()) {
      // The flyer lookup and the sheet load are both async; pop up once both are ready.
      effect(() => {
        if (this.flyerSrc() && this.activeFundraisers().length > 0 && !this.readDismissed()) {
          untracked(() => this.showFlyer.set(true));
        }
      });
    }
  }

  openFlyer(): void {
    this.showFlyer.set(true);
  }

  closeFlyer(): void {
    this.showFlyer.set(false);
    try { sessionStorage.setItem(FLYER_DISMISSED_KEY, 'true'); } catch { /* storage unavailable */ }
  }

  private readDismissed(): boolean {
    try { return !!sessionStorage.getItem(FLYER_DISMISSED_KEY); } catch { return false; }
  }

  fundraisers = this.store.fundraisers;
  activeFundraisers = this.store.activeFundraisers;
  totalRaised = this.store.totalRaised;
  activeIds   = computed(() => new Set(this.store.activeFundraisers().map(f => f.id)));
  pastIds     = computed(() => {
    const now = Date.now();
    return new Set(
      this.store.fundraisers()
        .filter(f => {
          if (!f.endDate) return false;
          const end = new Date(f.endDate);
          end.setHours(23, 59, 59, 999);
          return now > end.getTime();
        })
        .map(f => f.id)
    );
  });
  upcomingIds = computed(() => {
    const now = Date.now();
    return new Set(
      this.store.fundraisers()
        .filter(f => f.startDate && now < new Date(f.startDate).getTime())
        .map(f => f.id)
    );
  });
  isLoading = this.store.isLoading;
  hasError = this.store.error;

  // Scouting year starts in August: Aug 2026 → "26" / "27"
  readonly scoutingYearLabel: string = (() => {
    const now = new Date();
    const yr = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
    return `${yr.toString().slice(-2)}/${(yr + 1).toString().slice(-2)}`;
  })();
  readonly scoutingYearStart = this.scoutingYearLabel.slice(0, 2);
  readonly scoutingYearEnd   = this.scoutingYearLabel.slice(3);

  progressFor(f: Fundraiser): number {
    if (f.goal <= 0) return 0;
    return Math.min(100, Math.round((f.currentTotal / f.goal) * 100));
  }

  daysUntilEnd(f: Fundraiser): number {
    const end = new Date(f.endDate);
    end.setHours(23, 59, 59, 999);
    return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
  }
}

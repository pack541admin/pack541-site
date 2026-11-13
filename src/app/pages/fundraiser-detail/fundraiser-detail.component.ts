import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { FundraisingStore } from '../../shared/stores/fundraising.store';
import { FlyerStore } from '../../shared/stores/flyer.store';
import { FlyerModalComponent } from '../../components/flyer-modal/flyer-modal.component';

@Component({
  selector: 'app-fundraiser-detail',
  imports: [RouterLink, CurrencyPipe, FlyerModalComponent],
  templateUrl: './fundraiser-detail.component.html',
  styleUrl: './fundraiser-detail.component.scss'
})
export class FundraiserDetailComponent {
  private store = inject(FundraisingStore);
  private route = inject(ActivatedRoute);

  flyerSrc  = inject(FlyerStore).flyerSrc;
  showFlyer = signal(false);

  isLoading = this.store.isLoading;
  hasError  = this.store.error;

  private id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' }
  );

  fundraiser = computed(() => this.store.fundraiserById().get(this.id()));

  private dateStatus = computed(() => {
    const f = this.fundraiser();
    if (!f || !f.startDate || !f.endDate) return 'unknown';
    const now  = Date.now();
    const start = new Date(f.startDate).getTime();
    const end   = new Date(f.endDate);
    end.setHours(23, 59, 59, 999);
    if (now < start)          return 'upcoming';
    if (now > end.getTime())  return 'past';
    return 'active';
  });

  isActive   = computed(() => this.dateStatus() === 'active');
  isPast     = computed(() => this.dateStatus() === 'past');
  isUpcoming = computed(() => this.dateStatus() === 'upcoming');
  isGoalMet  = computed(() => this.progressPercent() >= 100);

  progressPercent = computed(() => {
    const f = this.fundraiser();
    if (!f || f.goal <= 0) return 0;
    return Math.min(100, Math.round((f.currentTotal / f.goal) * 100));
  });

  timePercent = computed(() => {
    const f = this.fundraiser();
    if (!f || !f.startDate || !f.endDate) return 0;
    const start = new Date(f.startDate).getTime();
    const end   = new Date(f.endDate);
    end.setHours(23, 59, 59, 999);
    const now = Date.now();
    if (now <= start)          return 0;
    if (now >= end.getTime())  return 100;
    return Math.round(((now - start) / (end.getTime() - start)) * 100);
  });

  daysIn = computed(() => {
    const f = this.fundraiser();
    if (!f || !f.startDate) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(f.startDate).getTime()) / 86_400_000));
  });

  daysRemaining = computed(() => {
    const f = this.fundraiser();
    if (!f || !f.endDate) return 0;
    const end = new Date(f.endDate);
    end.setHours(23, 59, 59, 999);
    return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
  });

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}

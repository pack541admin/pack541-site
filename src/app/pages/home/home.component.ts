import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

const RECRUITMENT_MODAL_DISMISSED_KEY = 'pack541-fall-recruitment-modal-dismissed';
const RECRUITMENT_MODAL_EXPIRES = new Date('2026-09-03T00:00:00');

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  private http = inject(HttpClient);

  carouselImages = signal<string[]>([]);
  activeIndex = signal(0);
  exitingIndex = signal(-1);

  showRecruitmentModal = signal(false);

  private intervalId?: ReturnType<typeof setInterval>;

  constructor(){

  }

  ngOnInit() {
    this.http.get<string[]>('images/carousel/manifest.json').subscribe(images => {
      this.carouselImages.set(this.shuffle(images));
      this.startCarousel();
    });

    if (new Date() < RECRUITMENT_MODAL_EXPIRES && !sessionStorage.getItem(RECRUITMENT_MODAL_DISMISSED_KEY)) {
      this.showRecruitmentModal.set(true);
    }
  }

  closeRecruitmentModal(): void {
    this.showRecruitmentModal.set(false);
    sessionStorage.setItem(RECRUITMENT_MODAL_DISMISSED_KEY, 'true');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showRecruitmentModal()) this.closeRecruitmentModal();
  }

  // Fisher-Yates shuffle. Randomizes the display order once when the images load;
  // that order then repeats for the rest of the session.
  private shuffle<T>(items: T[]): T[] {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private startCarousel() {
    this.intervalId = setInterval(() => {
      const total = this.carouselImages().length;
      if (total < 2) return;
      this.exitingIndex.set(this.activeIndex());
      this.activeIndex.update(i => (i + 1) % total);
    }, 5500);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  activities = [
    { icon: '⛺', title: 'Family Campouts', desc: 'At least 2 overnight campouts per year with the whole family.' },
    { icon: '🏅', title: 'Pinewood Derby', desc: 'The classic car-building race that kids (and parents!) love.' },
    { icon: '🥇', title: 'Pack Olympics', desc: 'Friendly competition games and activities for the whole pack.' },
    { icon: '⛵', title: 'Sailing & Maritime', desc: 'Overnight trips on sailing vessels — unforgettable adventures.' },
    { icon: '🎲', title: 'Hungry Hungry Hippos', desc: 'We set up a kid sized arena and watch the Chaos ensue.' },
    { icon: '🤝', title: 'Service Projects', desc: 'Giving back to our community through volunteer work.' },
  ];
}

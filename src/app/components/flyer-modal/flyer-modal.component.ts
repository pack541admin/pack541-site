import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-flyer-modal',
  template: `
    <div class="flyer-overlay" (click)="closed.emit()">
      <div class="flyer-dialog" role="dialog" aria-modal="true" aria-label="Fundraiser flyer" (click)="$event.stopPropagation()">
        <button type="button" class="flyer-close" (click)="closed.emit()" aria-label="Close flyer">✕</button>
        <img [src]="src()" [alt]="alt()" />
      </div>
    </div>
  `,
  styleUrl: './flyer-modal.component.scss'
})
export class FlyerModalComponent {
  src = input.required<string>();
  alt = input('Pack 541 fundraiser flyer');
  closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}

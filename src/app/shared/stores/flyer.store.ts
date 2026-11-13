import { Injectable, signal } from '@angular/core';

/**
 * Finds the active fundraising flyer.
 *
 * Drop an image named `fundraising-flyer-active` (any extension below) into
 * `public/images/fundraising/` and the "View Flyer" buttons appear. Remove or
 * rename the file to hide them.
 *
 * The site is static and can't list a folder, so this tries loading each
 * extension in turn and keeps the first one that is a real image. (A plain
 * HTTP check would be fooled by the host serving index.html for missing files.)
 */
const FLYER_BASE_PATH = 'images/fundraising/fundraising-flyer-active';
const FLYER_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Injectable({ providedIn: 'root' })
export class FlyerStore {
  /** URL of the active flyer, or null if there isn't one (or it's still being looked up). */
  readonly flyerSrc = signal<string | null>(null);

  constructor() {
    this.findFlyer();
  }

  private async findFlyer(): Promise<void> {
    for (const ext of FLYER_EXTENSIONS) {
      const src = `${FLYER_BASE_PATH}.${ext}`;
      if (await this.imageLoads(src)) {
        this.flyerSrc.set(src);
        return;
      }
    }
  }

  private imageLoads(src: string): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }
}

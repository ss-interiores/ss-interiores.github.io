import { Directive, ElementRef, OnChanges, Renderer2, booleanAttribute, inject, input, signal } from '@angular/core';
import { responsivePhoto } from './responsive-photo';

/**
 * Serves an optimized, responsive render on an existing `<img>`:
 * real `width`/`height` (reserves space), WebP `srcset` + `sizes`, a blurred
 * placeholder on the image frame (its parent) and a discreet fade-in once ready.
 *
 * Works on the `<img>` itself so the host component's encapsulated styles still apply.
 *
 * @example <img [appPhoto]="photo(path)" [photoSizes]="sizes.collectionCard" loading="lazy" alt="…" />
 */
@Directive({
  selector: 'img[appPhoto]',
  host: {
    '[class.photo-pending]': 'reveal() && pending()',
    '[class.photo-ready]': 'reveal() && !pending()',
    '(load)': 'pending.set(false)',
    '(error)': 'pending.set(false)',
  },
})
export class Photo implements OnChanges {
  /** Source render path, e.g. `images/projetos/aprovadas/…/vista-1.png`. */
  readonly appPhoto = input.required<string>();
  readonly photoSizes = input.required<string>();
  /** Placeholder + fade. Disable where the frame does not match the image (lightbox). */
  readonly reveal = input(true, { alias: 'photoReveal', transform: booleanAttribute });

  protected readonly pending = signal(true);
  private readonly image = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private current?: string;

  ngOnChanges(): void {
    const photo = responsivePhoto(this.appPhoto(), this.photoSizes());
    if (photo.src === this.current) return;
    this.current = photo.src;
    this.pending.set(true);

    // Order matters: dimensions and candidates must exist before `src` triggers a fetch.
    this.attribute('width', photo.width);
    this.attribute('height', photo.height);
    this.attribute('sizes', photo.sizes);
    this.attribute('srcset', photo.srcset);
    this.renderer.setAttribute(this.image, 'src', photo.src);

    const frame = this.image.parentElement;
    if (frame && this.reveal() && photo.placeholder) {
      this.renderer.setStyle(frame, 'background-image', photo.placeholder);
      this.renderer.setStyle(frame, 'background-size', 'cover');
      this.renderer.setStyle(frame, 'background-position', 'center');
      this.renderer.setStyle(frame, 'background-repeat', 'no-repeat');
    }
  }

  private attribute(name: string, value: string | number | undefined): void {
    if (value === undefined) this.renderer.removeAttribute(this.image, name);
    else this.renderer.setAttribute(this.image, name, String(value));
  }
}

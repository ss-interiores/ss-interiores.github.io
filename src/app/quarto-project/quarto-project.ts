import { Component, ElementRef, HostListener, ViewChild, computed, effect, input, signal } from '@angular/core';
import { Icon } from '../shared/icon';
import { RoomProjectData } from './room-project-data';
import { roomPhoto } from '../shared/project-photo';
import { Photo } from '../shared/photo';
import { PHOTO_SIZES } from '../shared/responsive-photo';

@Component({
  selector: 'app-quarto-project',
  imports: [Icon, Photo],
  host: { '[style.--room-green]': 'project().accent', '[style.--room-rust]': 'project().highlight' },
  templateUrl: './quarto-project.html',
  styleUrl: './quarto-project.css',
})
export class QuartoProject {
  @ViewChild('viewer') private viewer?: ElementRef<HTMLDialogElement>;
  private lastTrigger?: HTMLElement;
  protected readonly selected = signal(0);
  protected readonly sizes = PHOTO_SIZES;
  readonly project = input.required<RoomProjectData>();
  protected get gallery() { return this.project().gallery; }
  protected get palette() { return this.project().palette; }
  protected get specs() { return this.project().specs; }
  protected readonly selectedImage = computed(() => this.gallery[this.selected()] ?? this.gallery[0]);

  constructor() {
    effect(() => {
      this.project();
      this.selected.set(0);
      this.viewer?.nativeElement.close();
      this.lastTrigger = undefined;
    });
  }

  protected image(view: number): string {
    return roomPhoto(this.project().slug, view);
  }

  protected openImage(index: number, event: MouseEvent): void {
    this.lastTrigger = event.currentTarget as HTMLElement;
    this.selected.set(index);
    this.viewer?.nativeElement.showModal();
  }

  protected closeImage(): void {
    this.viewer?.nativeElement.close();
  }

  protected restoreFocus(): void {
    this.lastTrigger?.focus({ preventScroll: true });
  }

  protected step(direction: number): void {
    this.selected.update(index => (index + direction + this.gallery.length) % this.gallery.length);
  }

  protected backdrop(event: MouseEvent): void {
    if (event.target === this.viewer?.nativeElement) this.closeImage();
  }

  @HostListener('window:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (!this.viewer?.nativeElement.open) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.step(event.key === 'ArrowRight' ? 1 : -1);
    }
  }
}

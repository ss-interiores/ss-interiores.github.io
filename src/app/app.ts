import { Component, HostListener, computed, effect, signal } from '@angular/core';
import { QuartoProject } from './quarto-project/quarto-project';
import { Icon } from './shared/icon';
import { whatsappUrl } from './shared/contact';
import { StudioLogo } from './shared/studio-logo';
import { projectPhoto } from './shared/project-photo';
import { COLLECTIONS, Collection } from './shared/collections';
import { Photo } from './shared/photo';
import { PHOTO_SIZES } from './shared/responsive-photo';
import { HOME_HERO_PHOTO, ROOM_PAGES } from './shared/route-heroes';

@Component({
  selector: 'app-root',
  imports: [QuartoProject, Icon, StudioLogo, Photo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly photo = projectPhoto;
  protected readonly sizes = PHOTO_SIZES;
  protected readonly heroPhoto = HOME_HERO_PHOTO;
  protected readonly roomProjects = ROOM_PAGES;
  protected readonly menuOpen = signal(false);
  protected readonly activeProject = signal<Collection | null>(null);
  protected readonly whatsappHref = computed(() => whatsappUrl(this.activeProject()?.title));

  protected readonly collections = COLLECTIONS;

  constructor() {
    this.syncProjectFromPath();
    effect(() => {
      const project = this.activeProject();
      document.title = project ? `${project.title} — SS Interiores` : 'SS Interiores — Espaços para a vida acontecer';
    });
  }

  @HostListener('window:popstate')
  protected syncProjectFromPath(): void {
    this.activeProject.set(this.projectFromPath(window.location.pathname));
  }

  protected openProject(event: MouseEvent, project: Collection): void {
    event.preventDefault();
    window.history.pushState({}, '', `/projetos/${project.slug}`);
    this.activeProject.set(project);
    this.menuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected backToProjects(event: MouseEvent): void {
    event.preventDefault();
    window.history.pushState({}, '', '/#colecoes');
    this.activeProject.set(null);
    window.setTimeout(() => document.getElementById('colecoes')?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  private projectFromPath(path: string): Collection | null {
    const slug = path.match(/^\/projetos\/([^/]+)\/?$/)?.[1];
    return this.collections.find((project) => project.slug === slug) ?? null;
  }

  protected toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}

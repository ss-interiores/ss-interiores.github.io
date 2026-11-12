// Main (LCP) image of each route. Used by the templates and, at build time, by
// scripts/create-route-pages.mjs to preload it from each route's HTML.
// Keep this module free of Angular imports.
import { COLLECTIONS } from './collections';
import { projectPhoto, roomPhoto } from './project-photo';
import { PHOTO_SIZES } from './responsive-photo';
import { ROOM_PROJECTS } from '../quarto-project/room-project-data';
import { LIVING_PROJECTS } from '../quarto-project/living-project-data';

export const ROOM_PAGES = { ...ROOM_PROJECTS, ...LIVING_PROJECTS };

export const HOME_HERO_PHOTO = projectPhoto('images/projetos/cobertura-gourmet-jessica-gabriel/vista-1.png');

export interface RouteHero {
  /** Site path, e.g. `/` or `/projetos/quarto-gabi-juju`. */
  readonly path: string;
  /** Source render path, resolved through approvals. */
  readonly photo: string;
  readonly sizes: string;
}

export function routeHeroes(): readonly RouteHero[] {
  return [
    { path: '/', photo: HOME_HERO_PHOTO, sizes: PHOTO_SIZES.homeHero },
    ...COLLECTIONS.map((collection): RouteHero => {
      const path = `/projetos/${collection.slug}`;
      const room = ROOM_PAGES[collection.slug];
      return room
        ? { path, photo: roomPhoto(room.slug, room.gallery[0].view), sizes: PHOTO_SIZES.roomHero }
        : { path, photo: projectPhoto(collection.image), sizes: PHOTO_SIZES.detailCover };
    }),
  ];
}

export { responsivePhoto } from './responsive-photo';

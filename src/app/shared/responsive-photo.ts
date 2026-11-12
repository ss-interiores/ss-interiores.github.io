import { RESPONSIVE_PHOTOS } from './responsive-photos.generated';

/**
 * `sizes` for each layout slot. Shared by the templates and by the per-route
 * preload (scripts/create-route-pages.mjs), so both select the same candidate.
 * The page shell is at most 1760px wide with a side inset of up to 68px.
 */
export const PHOTO_SIZES = {
  /** Full-bleed home hero. */
  homeHero: '(min-width: 1760px) 1760px, 100vw',
  /** Intro and studio figures: 0.9fr of a two-column grid. */
  homeFeature: '(max-width: 760px) 100vw, (min-width: 1760px) 770px, 46vw',
  /** Portfolio cards: two columns, one below 420px. */
  collectionCard: '(max-width: 420px) 100vw, (min-width: 1760px) 810px, 48vw',
  /** Generic project cover: 1.25fr of a two-column grid. */
  detailCover: '(max-width: 760px) 100vw, (min-width: 1760px) 1000px, 62vw',
  /** Generic project gallery: two columns, one on mobile. */
  detailGallery: '(max-width: 760px) 100vw, (min-width: 1760px) 810px, 48vw',
  /** Room/living hero: 1.1fr of a two-column grid. */
  roomHero: '(max-width: 760px) 100vw, (min-width: 1760px) 860px, 54vw',
  /** Room/living gallery: half width, one column below 380px. */
  roomGallery: '(max-width: 380px) 100vw, (min-width: 1760px) 810px, 48vw',
  /** Room/living gallery wide items and single-column galleries. */
  fullWidth: '(min-width: 1760px) 1624px, 100vw',
  /** Lightbox: min(1080px, 96vw) dialog. */
  viewer: '(max-width: 1125px) 92vw, 1036px',
} as const;

export interface ResponsivePhoto {
  readonly src: string;
  readonly srcset?: string;
  readonly sizes?: string;
  readonly width?: number;
  readonly height?: number;
  /** CSS `url(...)` with a blurred low-quality preview. */
  readonly placeholder?: string;
}

/** URL of the WebP published for `original` (e.g. `images/projetos/x.png`) at `width`. */
export function optimizedPhotoUrl(original: string, width: number): string {
  return `images/otimizadas/${original.replace(/^images\//, '').replace(/\.png$/i, '')}-${width}.webp`;
}

/**
 * Resolves a source render to its optimized responsive variants. Falls back to the
 * original file when it has not been optimized yet (run `npm run images`).
 */
export function responsivePhoto(original: string, sizes: string): ResponsivePhoto {
  const entry = RESPONSIVE_PHOTOS[original];
  if (!entry) return { src: original };
  const { widths, width, height } = entry;
  const fallback = widths.find((candidate) => candidate >= 960) ?? widths[widths.length - 1];
  return {
    src: optimizedPhotoUrl(original, fallback),
    srcset: widths.map((candidate) => `${optimizedPhotoUrl(original, candidate)} ${candidate}w`).join(', '),
    sizes,
    width,
    height,
    placeholder: placeholderUrl(entry.placeholder, width, height),
  };
}

/** Wraps the tiny WebP in an SVG blur so the upscaled preview looks soft, not pixelated. */
function placeholderUrl(base64: string, width: number, height: number): string {
  const w = 640;
  const h = Math.round((w * height) / width);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>` +
    `<filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='18'/>` +
    `<feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter>` +
    `<image width='100%' height='100%' preserveAspectRatio='none' filter='url(#b)' href='data:image/webp;base64,${base64}'/></svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

// GitHub Pages serves physical directories for direct project links.
// Each entry page also gets a route-specific <link rel="preload" as="image">
// so the browser starts fetching the hero image before Angular boots.
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist/ss-interiores/browser');
const template = (await fs.readFile(path.join(output, 'index.html'), 'utf8'))
  .replace(/\s*<link rel="preload" as="image"[^>]*>/g, '');

const bundle = await build({
  entryPoints: [path.join(root, 'src/app/shared/route-heroes.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
});
const { routeHeroes, responsivePhoto } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);

const attr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function preloadLink(hero) {
  const photo = responsivePhoto(hero.photo, hero.sizes);
  const parts = [
    'rel="preload"',
    'as="image"',
    'type="image/webp"',
    photo.srcset ? `imagesrcset="${attr(photo.srcset)}"` : `href="${attr(photo.src)}"`,
    photo.sizes ? `imagesizes="${attr(photo.sizes)}"` : '',
    'fetchpriority="high"',
  ].filter(Boolean);
  return `  <link ${parts.join(' ')}>\n</head>`;
}

const heroes = routeHeroes();
for (const hero of heroes) {
  if (hero.path !== '/' && !/^\/projetos\/[a-z0-9-]+$/.test(hero.path)) {
    throw new Error(`Invalid route path: ${hero.path}`);
  }
  const directory = hero.path === '/' ? output : path.join(output, hero.path.slice(1));
  await fs.mkdir(directory, { recursive: true });
  const html = template.replace('</head>', preloadLink(hero));
  await fs.writeFile(path.join(directory, 'index.html'), html);
}
console.log(`Static entry pages with hero preload created for ${heroes.length} routes.`);

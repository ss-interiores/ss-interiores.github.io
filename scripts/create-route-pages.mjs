import fs from 'node:fs/promises';
import path from 'node:path';

// GitHub Pages serves physical directories for direct project links.
const source = await fs.readFile('src/app/app.ts', 'utf8');
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map(match => match[1]);
const output = path.resolve('dist/ss-interiores/browser');
const index = await fs.readFile(path.join(output, 'index.html'), 'utf8');
for (const slug of slugs) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid project slug: ${slug}`);
  const directory = path.join(output, 'projetos', slug);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'index.html'), index);
}
console.log(`Static entry pages created for ${slugs.length} projects.`);

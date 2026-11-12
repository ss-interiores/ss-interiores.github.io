import { APPROVED_PHOTO_ASSETS } from './approved-photo-assets';

export function projectPhoto(original: string): string {
  return APPROVED_PHOTO_ASSETS[original] ?? original;
}

/** Published render for a numbered view of a room/living project. */
export function roomPhoto(slug: string, view: number): string {
  return projectPhoto(`images/projetos/${slug}/vista-${view}.png`);
}

export function approvedAreaGourmetPhotos(): readonly { image: string; alt: string; caption: string }[] {
  const titles = ['Mesa de jogos e bancada', 'Cadeiras e divisória', 'Área de serviço'];
  return titles.flatMap((title, index) => {
    const image = APPROVED_PHOTO_ASSETS[`area-gourmet-apto-401/vista-${index + 1}`];
    return image ? [{ image, alt: `Visualização da área gourmet: ${title.toLowerCase()}.`, caption: `Área gourmet · ${title}` }] : [];
  });
}

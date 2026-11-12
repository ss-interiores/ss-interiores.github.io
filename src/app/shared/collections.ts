import { approvedAreaGourmetPhotos } from './project-photo';
import { APPROVED_PHOTO_ASSETS } from './approved-photo-assets';

export interface Collection {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly detail: string;
  readonly status: string;
  readonly motif: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly crop: string;
  readonly gallery: readonly ProjectImage[];
}

export interface ProjectImage {
  readonly image: string;
  readonly alt: string;
  readonly caption: string;
}

// Kept free of Angular imports: scripts/create-route-pages.mjs also reads it at build time.
export const COLLECTIONS: readonly Collection[] = ([
  {
    slug: 'quarto-antonio-catarina',
    title: 'Antonio e Catarina',
    category: 'Quarto infantil compartilhado',
    description: 'Um quarto para crescer, brincar e sonhar juntos.',
    detail: 'Madeira clara, verde suave e pequenos toques de terracota em um espaço pensado para duas infâncias.',
    status: 'Projeto de interiores',
    motif: 'infantil',
    image: 'images/projetos/quarto-antonio-catarina/vista-6.png',
    imageAlt: 'Quarto de Antonio e Catarina com beliche de madeira clara, painel verde e prateleiras de livros.',
    crop: 'antonio-catarina',
    gallery: [],
  },
  {
    slug: 'area-gourmet-apto-401',
    title: 'Área gourmet',
    category: 'Reforma residencial',
    description: 'Reforma de interiores com foco na área gourmet.',
    detail: 'Projeto de reforma de uma área gourmet em apartamento. O acervo do estúdio registra o espaço em quatro pranchas.',
    status: 'Reforma de interiores',
    motif: 'gourmet',
    image: 'images/projetos/projeto-area-gourmet-reforma.png',
    imageAlt: 'Render de reforma de área gourmet com mesa de jogos e bancada externa.',
    crop: 'gourmet-left',
    gallery: [{ image: 'images/projetos/projeto-area-gourmet-reforma.png', alt: 'Render de uma área gourmet residencial, com mesa de jogos e bancada.', caption: 'Área gourmet · Reforma residencial' }],
  },
  {
    slug: 'sala-estar-jantar-jessica-gabriel',
    title: 'Sala de estar e jantar',
    category: 'Projeto de interiores · Apartamento',
    description: 'Estar e jantar integrados para Jéssica e Gabriel.',
    detail: 'Marcenaria sob a escada, canto de estar com adega e uma composição de tons suaves, madeira e detalhes pretos.',
    status: 'Projeto com detalhamento',
    motif: 'sala',
    image: 'images/projetos/sala-estar-jantar-jessica-gabriel/vista-1.png',
    imageAlt: 'Sala de estar e jantar de Jéssica e Gabriel com poltronas marrons, espelho orgânico e mesa de jantar.',
    crop: 'local-render',
    gallery: [],
  },
  {
    slug: 'cobertura-gourmet-jessica-gabriel',
    title: 'Cobertura gourmet',
    category: 'Projeto de interiores · Apartamento',
    description: 'Uma cobertura para cozinhar, reunir e aproveitar.',
    detail: 'Área gourmet de Jéssica e Gabriel com bancada em L, churrasqueira, madeira e esquadrias pretas.',
    status: 'Projeto com detalhamento',
    motif: 'cobertura',
    image: 'images/projetos/cobertura-gourmet-jessica-gabriel/vista-1.png',
    imageAlt: 'Cobertura gourmet de Jéssica e Gabriel com bancada em L, banquetas e armários amadeirados.',
    crop: 'local-render',
    gallery: [],
  },
  {
    slug: 'quarto-gabi-juju',
    title: 'Gabi e Juju',
    category: 'Projeto de interiores',
    description: 'Um jardim para duas infâncias, com espaço para estudar, brincar e sonhar.',
    detail: 'Quarto compartilhado com beliche sob medida, bancada de estudos para duas, papel de parede Jardim Provence e detalhes em palha indiana.',
    status: 'Projeto de interiores',
    motif: 'quarto',
    image: 'images/projetos/quarto-gabi-juju/vista-3.png',
    imageAlt: 'Render de quarto infantil em tons de rosa, com bancada de estudos e espelhos redondos.',
    crop: 'gabi-juju',
    gallery: [{ image: 'images/projetos/projeto-quarto-infantil.png', alt: 'Render de quarto infantil com bancada de estudos, espelhos e papel de parede floral.', caption: 'Quarto infantil · Projeto de interiores' }],
  },
] satisfies readonly Collection[]).map((collection): Collection => {
  if (collection.slug !== 'area-gourmet-apto-401') return collection;
  const gallery = approvedAreaGourmetPhotos();
  if (!gallery.length) return collection;
  const cover = APPROVED_PHOTO_ASSETS['area-gourmet-apto-401/vista-1'];
  return { ...collection, gallery, image: cover ?? collection.image, crop: cover ? 'local-render' : collection.crop };
});

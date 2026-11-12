export interface RoomProjectData {
  readonly slug: string;
  readonly firstName: string;
  readonly secondName: string;
  readonly name: string;
  readonly joiner?: string;
  readonly category?: string;
  readonly tags?: readonly string[];
  readonly compactTitle?: boolean;
  readonly paletteTitle?: readonly [string, string];
  readonly kicker: string;
  readonly lede: readonly [string, string];
  readonly summary: string;
  readonly accent: string;
  readonly highlight: string;
  readonly coverCaption: string;
  readonly conceptTitle: readonly [string, string];
  readonly conceptParagraphs: readonly string[];
  readonly paletteDescription: readonly [string, string];
  readonly paletteNote: string;
  readonly specsNote: string;
  readonly closing: readonly [string, string];
  readonly gallery: readonly { view: number; title: string; detail: string; alt: string }[];
  readonly palette: readonly { name: string; hex: string; use: string; color: string }[];
  readonly specs: readonly { number: string; name: string; material: string; description: string }[];
}

export const ROOM_PROJECTS: Readonly<Partial<Record<string, RoomProjectData>>> = {
  'quarto-gabi-juju': {
    slug: 'quarto-gabi-juju', firstName: 'Gabi', secondName: 'Juju', name: 'Gabi & Juju',
    kicker: 'Um jardim para duas infâncias',
    lede: ['Entre flores e descobertas,', 'um lugar para crescer juntas.'],
    summary: 'Um quarto compartilhado que reúne descanso, estudo e imaginação. Rosas suaves, marcenaria clara e palha indiana dão forma a esse pequeno jardim.',
    accent: '#92716f', highlight: '#bb8f98', coverCaption: 'Delicadeza para o dia a dia',
    conceptTitle: ['Duas irmãs, um jardim.', 'Espaço para cada descoberta.'],
    conceptParagraphs: [
      'O beliche sob medida organiza a área de descanso e incorpora gavetões para guardar. Na parede oposta, uma mesa compartilhada oferece dois lugares para estudar, desenhar e criar, acompanhados por espelhos redondos.',
      'O papel de parede floral encontra os painéis rosados. A palha indiana aparece no beliche, nas gavetas e no móvel de apoio, conectando as peças pela textura. Cortinas cinza-claro com blackout completam a composição.',
    ],
    paletteDescription: ['Rosa suave, cinzas claros', 'e a textura acolhedora da palha.'],
    paletteNote: 'Amostras HEX aproximadas dos renders. O executivo especifica as tintas Árvore dos Sonhos e Açúcar Cristal, da Suvinil; as amostras digitais não substituem o catálogo físico da fabricante.',
    specsNote: 'Informações extraídas do executivo do quarto Júlia e Gabriela, de 06/08/2024: planta de layout, detalhamento de paredes e marcenaria e memorial descritivo. As medidas devem ser conferidas no local, conforme indicado nas pranchas.',
    closing: ['Um quarto para dividir.', 'Um jardim de possibilidades.'],
    gallery: [
      { view: 3, title: 'Um jardim para duas', detail: 'Estudo, descanso e delicadeza', alt: 'Quarto Gabi e Juju com bancada de estudos, espelhos redondos, papel de parede floral e beliche com palha indiana.' },
      { view: 1, title: 'Descansar e sonhar', detail: 'Beliche sob medida e gavetões', alt: 'Beliche com estrutura amadeirada, escada clara, gavetões e detalhes em palha indiana.' },
      { view: 2, title: 'Criar lado a lado', detail: 'Bancada compartilhada e espelhos', alt: 'Bancada de estudos com dois lugares, cadeiras de madeira, espelhos redondos e gavetas com palha.' },
      { view: 5, title: 'Um jardim na parede', detail: 'Flores, cores e pequenos materiais', alt: 'Detalhe do papel de parede floral sobre bancada clara com espelhos, lápis e organizadores.' },
      { view: 6, title: 'Guardar as descobertas', detail: 'Livros, cestos e espelho em arco', alt: 'Móvel de apoio com livros, cestos, gavetão com palha e espelho em arco na parede lateral.' },
      { view: 4, title: 'A luz de cada dia', detail: 'Janela, cortinas e circulação', alt: 'Vista do quarto com beliche à esquerda, bancada à direita e cortina cinza-claro na janela ao fundo.' },
    ],
    palette: [
      { name: 'Rosa suave', hex: '#BC9298', color: '#BC9298', use: 'Árvore dos Sonhos · Suvinil' },
      { name: 'Neutro claro', hex: '#E9E7E4', color: '#E9E7E4', use: 'Açúcar Cristal · Suvinil' },
      { name: 'Cinza claro', hex: '#CFCCCA', color: '#CFCCCA', use: 'Laca, MDF e cortinas' },
      { name: 'Amadeirado', hex: '#C4AB8C', color: '#C4AB8C', use: 'Estrutura do beliche' },
      { name: 'Palha natural', hex: '#BAA27D', color: '#BAA27D', use: 'Frentes e detalhes tramados' },
    ],
    specs: [
      { number: '01', name: 'Beliche sob medida', material: 'MDF amadeirado + palha indiana', description: 'Estrutura em MDF amadeirado, escada e gavetões em MDF laqueado cinza-claro. Os painéis de palha aparecem nos fechamentos das camas.' },
      { number: '02', name: 'Mesa de estudos', material: '204 × 40 cm · quatro gavetas', description: 'Mesa compartilhada com interior em MDF branco TX, acabamento externo cinza-claro e quatro gavetas com frentes em palha indiana e puxador passante.' },
      { number: '03', name: 'Paredes e pintura', material: 'Árvore dos Sonhos + Açúcar Cristal · Suvinil', description: 'Árvore dos Sonhos nos painéis inferiores e Açúcar Cristal nas superfícies indicadas de parede e teto, conforme o detalhamento.' },
      { number: '04', name: 'Papel de parede', material: 'Jardim Provence · Uauá Baby / Uauá Kids', description: 'Painel floral especificado no executivo, em módulos de 170 × 100 cm, compondo a faixa superior das paredes do quarto.' },
      { number: '05', name: 'Espelhos e cadeiras', material: 'Molduras em MDF + madeira jatobá', description: 'Espelhos redondos com LED e moldura em MDF, espelho em arco de 110 × 45 cm com moldura branca e cadeiras com encosto e assento anatômicos em madeira jatobá.' },
      { number: '06', name: 'Cortinas e tapetes', material: 'Linho cinza-claro com blackout', description: 'Cortinas em linho cinza-claro com blackout. O layout prevê tapete retangular de 160 × 100 cm e redondo de 120 cm de diâmetro, com modelos a definir.' },
    ],
  },
  'quarto-antonio-catarina': {
    slug: 'quarto-antonio-catarina', firstName: 'Antonio', secondName: 'Catarina', name: 'Antonio & Catarina',
    kicker: 'Duas infâncias, um universo',
    lede: ['Um quarto para crescer,', 'brincar e sonhar juntos.'],
    summary: 'Madeira que acolhe, cores que acalmam e espaço para imaginar. Um pequeno universo onde cada um tem seu lugar.',
    accent: '#68735d', highlight: '#ac5846', coverCaption: 'Um lugar para ser criança',
    conceptTitle: ['Compartilhar o quarto.', 'Multiplicar as histórias.'],
    conceptParagraphs: ['O beliche libera espaço para as descobertas do dia a dia. Ao lado, livros e brinquedos compõem um cantinho de leitura que faz parte da vida do quarto.', 'O verde suave encontra a madeira clara, enquanto a faixa terracota e os quadros trazem personalidade. O xadrez, a trama natural e os tecidos acrescentam textura sem pesar.'],
    paletteDescription: ['Verdes suaves, neutros quentes', 'e um toque de terracota.'],
    paletteNote: 'Paleta interpretada a partir das imagens. Os códigos HEX são referências digitais aproximadas; marcas e códigos de tintas e acabamentos serão definidos na especificação técnica.',
    specsNote: 'Descrição visual dos elementos representados no projeto. Medidas, composição dos materiais, fornecedores e referências comerciais dependem do detalhamento executivo.',
    closing: ['Um espaço. Duas personalidades.', 'Infinitas possibilidades.'],
    gallery: [
    { view: 6, title: 'Um espaço para dois', detail: 'Beliche, leitura e luz natural', alt: 'Vista geral do quarto com beliche em madeira clara, painel verde, livros e cortinas claras.' },
    { view: 3, title: 'Descansar e sonhar', detail: 'Madeira clara e verde suave', alt: 'Beliche de madeira clara com escada lateral e roupa de cama verde suave.' },
    { view: 4, title: 'Pequenas descobertas', detail: 'Livros, brinquedos e memórias', alt: 'Parede de quadros infantis, prateleiras de livros e móvel baixo branco com portas em trama natural.' },
    { view: 7, title: 'Tudo ao alcance', detail: 'Um cantinho para brincar e ler', alt: 'Detalhe das prateleiras, brinquedos, cesto e portas com trama natural.' },
    { view: 5, title: 'Lugar para guardar', detail: 'Frentes claras e contorno amadeirado', alt: 'Armário de portas de correr claras com moldura amadeirada.' },
    { view: 2, title: 'O olhar de quem entra', detail: 'O encontro das cores e texturas', alt: 'Perspectiva do quarto a partir da entrada com beliche, prateleiras e papel de parede xadrez.' },
    { view: 1, title: 'A luz faz parte', detail: 'Cortina leve junto ao beliche', alt: 'Luz natural atravessando a cortina clara ao lado do beliche.' },
    { view: 8, title: 'Texturas sob a luz', detail: 'Armário e cortina em outra perspectiva', alt: 'Armário de portas claras iluminado pela janela com cortina translúcida.' },
  ],
    palette: [
    { name: 'Verde sálvia', hex: '#929B82', use: 'Painel e roupa de cama', color: '#929B82' },
    { name: 'Terracota', hex: '#AC5846', use: 'Faixa de destaque', color: '#AC5846' },
    { name: 'Madeira clara', hex: '#CEA778', use: 'Beliche e prateleiras', color: '#CEA778' },
    { name: 'Branco quente', hex: '#ECE8DF', use: 'Mobiliário e cortinas', color: '#ECE8DF' },
    { name: 'Areia', hex: '#C6BCAA', use: 'Texturas e complementos', color: '#C6BCAA' },
  ],
    specs: [
    { number: '01', name: 'Beliche', material: 'Acabamento amadeirado claro', description: 'Duas camas sobrepostas, com escada lateral e proteção na cama superior.' },
    { number: '02', name: 'Paredes', material: 'Painel verde + detalhe terracota', description: 'Painel com frisos verticais, arremate terracota e composição de quadros infantis.' },
    { number: '03', name: 'Papel de parede', material: 'Xadrez em tons suaves', description: 'Padronagem miúda na parede do beliche, em diálogo com os verdes do ambiente.' },
    { number: '04', name: 'Leitura e organização', material: 'Madeira, branco e trama natural', description: 'Duas prateleiras para livros e móvel baixo com nichos abertos, portas tramadas e cesto.' },
    { number: '05', name: 'Armário', material: 'Frentes claras + contorno amadeirado', description: 'Portas de correr e desenho de linhas simples, com acabamento claro nas frentes.' },
    { number: '06', name: 'Têxteis e piso', material: 'Tons naturais e textura amadeirada', description: 'Cortina clara translúcida, tapete redondo com pompons e piso em paginação espinha de peixe.' },
  ],
  },
};

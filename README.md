# SS Interiores

Site responsivo de interiores feito com Angular standalone. A interface usa imagens locais, navegação por âncoras, menu móvel e estados visuais acessíveis a teclado.

## Desenvolvimento local

Requer Node.js 24 e npm.

```bash
npm ci
npm start
```

O servidor de desenvolvimento fica em `http://localhost:4200` e atualiza a página ao salvar alterações.

A página do quarto Antonio e Catarina fica em `/projetos/quarto-antonio-catarina`, também acessível pela seleção de projetos. Inclui oito renders, galeria ampliada com navegação pelas setas do teclado, paleta visual e descrição dos materiais. As cores são aproximações digitais dos renders; referências comerciais e medidas precisam do detalhamento executivo.

As páginas de Gabi e Juju, sala de estar e jantar de Jéssica e Gabriel e cobertura gourmet de Jéssica e Gabriel usam a mesma apresentação com galeria, conceito, paleta e especificações. Cada uma contém seis renders locais. A área gourmet do Apê 401 mantém a apresentação resumida.

## Build

```bash
npm run build
```

Para gerar os arquivos com o caminho base do GitHub Pages deste repositório:

```bash
npm run build:pages
```

Os arquivos de publicação ficam em `dist/ss-interiores/browser`.

O comando `build:pages` também gera entradas HTML para as cinco rotas de projetos, permitindo abrir e atualizar seus endereços diretamente no GitHub Pages.

## Publicação

O workflow `.github/workflows/deploy.yml` compila e publica o site quando há um push para `main` (ou ao executar o workflow manualmente). Nas configurações do repositório, selecione **Settings → Pages → Build and deployment → Source → GitHub Actions**.

O endereço esperado do site é `https://ss-interiores.github.io/`.

## Conteúdo a configurar

Antes de usar o site publicamente, substitua os dados de contato e redes sociais de exemplo no rodapé pelos canais oficiais da empresa. As referências das imagens estão em [CREDITS.md](CREDITS.md).

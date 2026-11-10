# SS Interiores

Site responsivo de interiores feito com Angular standalone. A interface usa imagens locais, navegação por âncoras, menu móvel e estados visuais acessíveis a teclado.

## Desenvolvimento local

Requer Node.js 24 e npm.

```bash
npm ci
npm start
```

O servidor de desenvolvimento fica em `http://localhost:4200` e atualiza a página ao salvar alterações.

## Build

```bash
npm run build
```

Para gerar os arquivos com o caminho base do GitHub Pages deste repositório:

```bash
npm run build:pages
```

Os arquivos de publicação ficam em `dist/ss-interiores/browser`.

## Publicação

O workflow `.github/workflows/deploy.yml` compila e publica o site quando há um push para `main` (ou ao executar o workflow manualmente). Nas configurações do repositório, selecione **Settings → Pages → Build and deployment → Source → GitHub Actions**.

O endereço esperado para o projeto é `https://ss-interiores.github.io/ssinteriores/`.

## Conteúdo a configurar

Antes de usar o site publicamente, substitua os dados de contato e redes sociais de exemplo no rodapé pelos canais oficiais da empresa. As referências das imagens estão em [CREDITS.md](CREDITS.md).

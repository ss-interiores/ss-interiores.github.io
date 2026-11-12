import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const reviewDir = path.join(root, 'outputs/photo-review');
const manifestFile = path.join(reviewDir, 'manifest.json');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const read = () => JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const save = data => fs.writeFileSync(manifestFile, JSON.stringify(data, null, 2) + '\n');
const critiques = [
  'O pontilhado da cortina e as sombras fechadas prejudicam a leitura dos tecidos e revelam o render; limpar a transparência e recuperar detalhes escuros mantendo o contraluz.',
  'A roupa de cama rígida e a madeira muito uniforme reduzem a naturalidade dos materiais; refinar dobras, contato e rugosidade sem alterar padrões ou acabamentos.',
  'Colchões e travesseiros com pouca deformação deixam a cama artificial; melhorar dobras, costuras e resposta do tecido à luz preservando suas formas e estampas.',
  'O móvel e os brinquedos lisos demais deixam o conjunto com aparência de catálogo 3D; acrescentar microtextura e sombras de contato fisicamente plausíveis sem mudar os objetos.',
  'A granulação dos reflexos e as frentes excessivamente uniformes denunciam o render; limpar o ruído e refinar folgas, bordas e rugosidade da laca preservando o armário.',
  'A roupa de cama pouco natural e o pontilhado da cortina limitam a aparência de fotografia; refinar o tecido e sua transparência mantendo iluminação, estampa e enquadramento.',
  'As bordas perfeitas e o acabamento uniforme dos objetos ainda parecem modelados; refinar pequenas sombras, relevos e rugosidade conservando todos os elementos.',
  'As sombras fechadas e a cortina granulada escondem materiais e deixam o ambiente artificial; equilibrar a exposição e limpar transparências mantendo o sentido da luz.',
  'Os colchões planos, os veios repetitivos e os fachos regulares dos spots revelam o render; dar naturalidade aos tecidos, à madeira e à distribuição da luz preservando o desenho.',
  'O tampo uniforme, os veios artificiais das cadeiras e a repetição de acessórios reduzem o realismo; refinar materiais, microtextura e reflexos sem trocar ou reposicionar os objetos.',
  'As superfícies homogêneas e os tecidos sem volume deixam a perspectiva com aspecto digital; refinar materiais, encontros e tecido mantendo layout, cores e proporções.',
  'As sombras fechadas e a baixa definição da paisagem deixam interior e exterior pouco integrados; recuperar detalhes e tornar o fundo mais natural mantendo sua composição.',
  'O brilho uniforme do tampo, a moldura com veios artificiais e os acessórios simplificados revelam o render; refinar rugosidade, madeira e microdetalhes preservando cada objeto.',
  'A trama repetida dos cestos e as prateleiras e bonecos excessivamente regulares denunciam a modelagem; naturalizar superfícies e sombras de contato sem alterar quantidade, forma ou posição.',
  'A cortina granulada, os reflexos ruidosos, o couro plástico e a luz manchada revelam o render; limpar transparências e calibrar rugosidade e iluminação indireta preservando o projeto.',
  'As manchas de iluminação, as sombras fechadas e os acabamentos uniformes deixam a cena artificial; refinar luz indireta, contato e microtextura mantendo toda a mesa e marcenaria.',
  'Os veios repetidos, o brilho pontilhado e o tampo excessivamente liso revelam o render; limpar reflexos e refinar madeira, bordas e rugosidade mantendo os acabamentos originais.',
  'O halo intenso do espelho, o pontilhado da cortina e os móveis sem detalhe nas sombras prejudicam o realismo; equilibrar exposição e luz do espelho e limpar transparências.',
  'A cortina granulada, as paredes manchadas e o couro plástico denunciam o render; refinar a luz indireta, a transparência do tecido e a rugosidade das poltronas.',
  'O couro brilhante, a cortina ruidosa e o halo excessivo do espelho deixam o estar artificial; calibrar rugosidade e iluminação e limpar reflexos mantendo todos os elementos.',
  'A vegetação repetida, a madeira uniforme, a pedra grosseira e as sombras fechadas revelam o render; naturalizar os mesmos materiais e folhas e recuperar detalhes sem adicionar vegetação.',
  'As folhas angulosas, as banquetas escondidas nas sombras e os veios repetidos denunciam a computação gráfica; corrigir a geometria local e refinar materiais e exposição sem mudar a cena.',
  'As sombras fechadas e os reflexos artificiais da água e dos metais deixam o espaço pouco fotográfico; corrigir a resposta física dos materiais e equilibrar a exposição mantendo paisagem e objetos.',
  'A repetição da pedra e da madeira e as telhas e encontros simplificados revelam a modelagem; refinar microtextura e geometria local preservando desenho, proporções e materiais.',
  'O ripado uniforme, a luz manchada e os materiais simplificados deixam o estar com aspecto digital; refinar textura e iluminação mantendo sofá, vegetação, TV e o conteúdo da tela.',
  'A repetição dos veios, a pedra sem relevo convincente e as sombras fechadas revelam o modelo 3D; corrigir escala e variação das texturas, resposta dos materiais à luz e exposição do fundo.',
];

export function makePrompt(item, feedback = '') {
  return `Use case: style-transfer. Asset: SS Interiores architectural portfolio, ${item.project}, view ${item.view}.
Input image 1: the ONLY edit target and strict composition reference, an existing 3D rendering.
Primary request: make this exact image look like a real professional architectural camera photograph through subtle physical material, lighting and optical corrections. Preserve the scene precisely, as if photographing the existing design from the identical camera.
Specific critique and solution: ${item.critique}
User material/geometry corrections: ${item.materialNotes ?? 'None beyond the source image.'}
Render cleanup: remove low-frequency splotches, chromatic clouds, uneven color patches, waxy denoiser smearing, speckles and low-sample illumination artifacts from walls, ceilings and repeated patterns. Preserve legitimate smooth illumination gradients, contact shadows and fine material detail. Wallpaper has a stable, consistent base color and clean repeating pattern; do not reinterpret blotchy lighting as stains or variable wallpaper colors. Keep pattern alignment and scale unchanged.
Plain painted walls and ceilings stay smooth painted plaster with extremely subtle paint texture, NEVER added linen, canvas, woven fabric, crosshatching, coarse stucco or a new wall covering. Printed wallpapers retain only the original printed design. Do not invent inscriptions, names or personalization on any object.
Keep original printed graphics as existing flat texture maps; do not redraw book covers or posters. When source lettering is unreadable, retain the original soft detail rather than making up new words.
Geometry cleanup: straight curtain rods have a constant plausible diameter with correct perspective, circular grommets and sound wall supports; avoid stretched, tapering, bent or floating rods, while keeping original mounting and position.
${item.materialReference ? 'Input image 2 is ONLY a user-supplied close-up reference for the existing Indian cane weave: thin flat interlaced natural strips, real open polygonal apertures, visible crossing depth and delicate shadows. Apply this ONLY to the cane panels already present, at the original fine scale and original color, never to rope/string baskets. Do not add cane anywhere else. Do not copy the blue background, curled sheet, frayed edges or oversized macro scale into the scene.' : ''}
Composition: retain exact framing, perspective, relative dimensions and original ${item.width}:${item.height} aspect ratio; do not crop or outpaint.
INVARIANTS: keep every object, its count, position, silhouette and design, all architecture and openings, joinery divisions, furniture, decorative objects, plant locations, roofing structure, existing background skyline, artwork, book covers, legible text, TV screen content and reflections' scene content. Keep original colors, material identities, wood grain direction, fabric patterns and time of day. Keep the room looking new; do not add weathering, stains or a different finish. No added trees, flowers, leaves as new scene elements, props or people. Do not replace the landscape with another scene. Do not change the cabinet configuration, window dimensions, floor pattern or camera position.
Allowed changes: realistic fine texture at the existing scale, natural material roughness, physically correct light transmission and contact shadows, cleaner reflections and plausible exposure. Correct only visibly defective local geometry, such as an angular leaf or malformed tile, preserving its position and overall shape. For bedding preserve all patterns and silhouettes while making existing folds physically plausible.
Photography: natural photographic exposure, true material response and coherent crisp detail, realistic lens rendering. Retain the original light direction and mood with modest shadow recovery. No artificial HDR, no excessive blur or sharpening, no illustration or glossy CGI look. No new text or watermarks. One finished photograph only.
${feedback ? `Revision feedback, mandatory: ${feedback}` : ''}`.trim();
}

function initialize() {
  if (fs.existsSync(manifestFile)) return read();
  for (const directory of ['originals','candidates','prompts','decisions','batches','previews']) fs.mkdirSync(path.join(reviewDir, directory), { recursive:true });
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'outputs/catalogo-imagens-2026-11-11/catalogo.json'), 'utf8'));
  const items = catalog.images.filter(item => item.view !== null).map((item,index) => {
    const source = path.join(root, 'public', item.path);
    const original = path.join(reviewDir, 'originals', `${item.id}.png`);
    fs.copyFileSync(source, original, fs.constants.COPYFILE_EXCL);
    return { id:item.id, project:item.project, slug:item.slug, view:item.view, title:item.title, source:item.path, original:relative(original), originalHash:sha(original), width:item.width, height:item.height, originalScore:item.score, critique:critiques[index], versions:[], published:null };
  });
  const cropDefinitions = [
    ['IMG-27A',1,'Mesa de jogos e bancada',[289,329,561,557],'A baixa definição, a luz plana e os objetos com materiais simplificados deixam o recorte artificial; reconstruir microdetalhes e luz física conservando todos os elementos visíveis.'],
    ['IMG-27B',2,'Cadeiras e divisória',[938,337,400,554],'As tramas rígidas, os objetos simplificados e as sombras fracas revelam o modelo 3D; refinar materiais, geometria local e sombras de contato mantendo o recorte e o mobiliário.'],
    ['IMG-27C',3,'Área de serviço',[1447,208,278,330],'A baixa definição, os revestimentos planos e os objetos simplificados reduzem o realismo; refinar textura, luz e microdetalhes preservando a área efetivamente visível.'],
  ];
  for (const [id,view,title,crop,critique] of cropDefinitions) {
    items.push({id, project:'Área gourmet · Apê 401',slug:'area-gourmet-apto-401',view,title,source:'images/projetos/projeto-area-gourmet-reforma.png',original:`outputs/photo-review/originals/${id}.png`,originalHash:null,width:crop[2],height:crop[3],originalScore:2,critique,crop,versions:[],published:null});
  }
  const manifest = {schemaVersion:1,createdAt:new Date().toISOString(),generationMode:'built-in-imagegen',publicationMode:'approved-batches',items,batches:[]};
  save(manifest);
  fs.copyFileSync(path.join(root,'public/images/projetos/projeto-area-gourmet-reforma.png'),path.join(reviewDir,'originals','prancha-area-gourmet.png'),fs.constants.COPYFILE_EXCL);
  return manifest;
}

function request(id,feedback='') {
  const manifest=read(); const item=manifest.items.find(item=>item.id===id);
  if(!item) throw Error('Unknown image ID');
  const input=path.join(root,item.original);
  if(!fs.existsSync(input)) throw Error('Original missing');
  const hash=sha(input);
  if(item.originalHash && item.originalHash!==hash) throw Error('Original changed');
  item.originalHash=hash;
  const version=1+Math.max(0,...item.versions.map(candidate=>candidate.version));
  const accumulatedFeedback=[...new Set([...item.versions.map(candidate=>candidate.feedback),item.requestedFeedback,feedback].filter(Boolean))].join('\n');
  const prompt=makePrompt(item,accumulatedFeedback);
  const promptFile=path.join(reviewDir,'prompts',`${id}-v${version}.txt`);
  fs.writeFileSync(promptFile,prompt);
  item.versions.push({version,status:'generating',prompt:relative(promptFile),createdAt:new Date().toISOString(),originalHash:hash,feedback,accumulatedFeedback});
  save(manifest);
  const references=[input];
  if(item.materialReference) references.push(path.join(reviewDir,'references','palha-indiana.png'));
  return {id,version,input,references,prompt};
}

function record(id,version,file) {
  const manifest=read();const item=manifest.items.find(item=>item.id===id);const candidate=item?.versions.find(candidate=>candidate.version===Number(version));
  if(!candidate || candidate.status!=='generating') throw Error('Generation not registered');
  const destination=path.join(reviewDir,'candidates',`${id}-v${version}.png`);
  fs.copyFileSync(file,destination,fs.constants.COPYFILE_EXCL);
  Object.assign(candidate,{file:relative(destination),hash:sha(destination),status:'awaiting-qa'});save(manifest);
  return {id,version,file:destination};
}

function qa(id,version,score,fidelity,notes) {
  const manifest=read();const candidate=manifest.items.find(item=>item.id===id)?.versions.find(candidate=>candidate.version===Number(version));
  if(!candidate?.file)throw Error('Candidate missing');
  if(![1,2,3,4,5].includes(Number(score)))throw Error('Score must be 1–5');
  Object.assign(candidate,{score:Number(score),fidelity:fidelity==='pass',qaNotes:notes,status:fidelity==='pass'?'pending':'qa-rejected',reviewedAt:new Date().toISOString()});save(manifest);return candidate;
}

export function validateDecisions(manifest, payload, hashOf = file => sha(path.join(root,file))) {
  if(payload?.schemaVersion!==1 || !Array.isArray(payload.decisions) || !payload.decisions.length || payload.decisions.length>29) throw Error('Invalid review batch');
  const seen=new Set();
  return payload.decisions.map(decision=>{
    if(seen.has(decision.id))throw Error('Duplicate image decision');
    seen.add(decision.id);
    if(!['approve','redo','pending'].includes(decision.decision))throw Error('Unknown decision');
    if(typeof decision.feedback!=='string' || decision.feedback.length>2000)throw Error('Invalid feedback');
    const item=manifest.items.find(item=>item.id===decision.id);
    const candidate=item?.versions.find(candidate=>candidate.version===decision.version);
    if(!candidate || !candidate.fidelity || !['pending','approved','published'].includes(candidate.status))throw Error('Candidate has not passed QA');
    const latest=[...item.versions].reverse().find(candidate=>candidate.fidelity && ['pending','approved','published'].includes(candidate.status));
    if(latest!==candidate)throw Error('Stale candidate version: refresh the review');
    if(decision.hash!==candidate.hash || hashOf(candidate.file)!==candidate.hash)throw Error('Candidate fingerprint mismatch');
    if(hashOf(item.original)!==item.originalHash)throw Error('Original fingerprint mismatch');
    return {item,candidate,decision};
  });
}

function readApprovedAssets() {
  const source=fs.readFileSync(path.join(root,'src/app/shared/approved-photo-assets.ts'),'utf8');
  const match=source.match(/= (\{[\s\S]*\});/);
  if(!match)throw Error('Cannot read existing approved assets');
  return JSON.parse(match[1]);
}

function applyDecisions(file, dryRun=false) {
  const manifest=read();
  const payload=JSON.parse(fs.readFileSync(file,'utf8'));
  // Validate the entire batch before changing files or statuses.
  const selections=validateDecisions(manifest,payload);
  const summary={approved:selections.filter(s=>s.decision.decision==='approve').map(s=>s.item.id),redo:selections.filter(s=>s.decision.decision==='redo').map(s=>s.item.id),pending:selections.filter(s=>s.decision.decision==='pending').map(s=>s.item.id)};
  if(dryRun)return summary;
  const assets=readApprovedAssets();
  const batchId=new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(3).toString('hex');
  const batch={id:batchId,status:'prepared',createdAt:new Date().toISOString(),decisions:payload.decisions,assets:[]};
  for(const {item,candidate,decision} of selections) {
    if(decision.decision==='approve') {
      const asset=`images/projetos/aprovadas/${item.slug}/vista-${item.view}-v${candidate.version}-${candidate.hash.slice(0,12)}.png`;
      const destination=path.join(root,'public',asset);
      fs.mkdirSync(path.dirname(destination),{recursive:true});
      if(fs.existsSync(destination)){if(sha(destination)!==candidate.hash)throw Error('Approved destination differs');}
      else fs.copyFileSync(path.join(root,candidate.file),destination,fs.constants.COPYFILE_EXCL);
      const key=item.crop?`${item.slug}/vista-${item.view}`:item.source;
      assets[key]=asset;
      batch.assets.push({id:item.id,version:candidate.version,hash:candidate.hash,asset});
    }
  }
  if(batch.assets.length) {
    const approvedFile=path.join(root,'src/app/shared/approved-photo-assets.ts');
    const source='// Updated only after explicit, version-specific approval.\nexport const APPROVED_PHOTO_ASSETS: Readonly<Record<string, string>> = '+JSON.stringify(assets,null,2)+';\n';
    fs.writeFileSync(approvedFile+'.new',source);fs.renameSync(approvedFile+'.new',approvedFile);
    const creditsFile=path.join(root,'CREDITS.md');
    const credits=fs.readFileSync(creditsFile,'utf8');
    if(!credits.includes('## Versões fotográficas com IA'))fs.appendFileSync(creditsFile,'\n## Versões fotográficas com IA\n\nOs arquivos de `public/images/projetos/aprovadas/` são versões dos renders do estúdio transformadas com a ferramenta integrada imagegen para obter aparência fotográfica, mantendo o projeto como referência. Cada versão publicada passa por seleção humana; os originais e o histórico de prompts e decisões permanecem no acervo local de revisão.\n');
  }
  for(const {item,candidate,decision} of selections) {
    candidate.decision={value:decision.decision,feedback:decision.feedback,at:batch.createdAt,batchId};
    if(decision.decision==='approve' && candidate.status!=='published')candidate.status='approved';
    if(decision.decision==='redo')candidate.status='rejected';
    if(decision.decision==='redo')item.requestedFeedback=decision.feedback;
  }
  manifest.batches.push(batch);
  save(manifest);
  fs.writeFileSync(path.join(reviewDir,'decisions',batchId+'.json'),JSON.stringify(payload,null,2)+'\n');
  fs.writeFileSync(path.join(reviewDir,'batches',batchId+'.json'),JSON.stringify(batch,null,2)+'\n');
  return {...summary,batchId,assets:batch.assets,status:batch.status};
}

async function verifyPublished(batchId, commit) {
  if(!/^[a-f0-9]{40}$/.test(commit??''))throw Error('A full commit SHA is required');
  const manifest=read();const batch=manifest.batches.find(batch=>batch.id===batchId);
  if(!batch?.assets.length)throw Error('No assets to verify');
  const assets=readApprovedAssets();
  for(const asset of batch.assets) {
    const item=manifest.items.find(item=>item.id===asset.id);
    const key=item.crop?`${item.slug}/vista-${item.view}`:item.source;
    if(assets[key]!==asset.asset)throw Error('A newer batch superseded this asset');
    const url=new URL(asset.asset,'https://ss-interiores.github.io/');url.searchParams.set('review',asset.hash.slice(0,12));
    const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
    if(!response.ok)throw Error('Published image not available: '+response.status);
    const hash=crypto.createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
    if(hash!==asset.hash)throw Error('Published image differs from approved image');
  }
  batch.status='published';batch.commit=commit;batch.verifiedAt=new Date().toISOString();
  for(const asset of batch.assets){const item=manifest.items.find(item=>item.id===asset.id);item.published={...asset,batchId,commit,at:batch.verifiedAt};item.versions.find(candidate=>candidate.version===asset.version).status='published';}
  save(manifest);fs.writeFileSync(path.join(reviewDir,'batches',batchId+'.json'),JSON.stringify(batch,null,2)+'\n');
  return {batchId,status:batch.status,verified:batch.assets.length,commit};
}

const command=process.argv[2];
if(command==='init') console.log(JSON.stringify({items:initialize().items.length}));
else if(command==='request')console.log(JSON.stringify(request(process.argv[3],process.argv[4])));
else if(command==='record')console.log(JSON.stringify(record(...process.argv.slice(3))));
else if(command==='qa'){const result=qa(...process.argv.slice(3));console.log(JSON.stringify({id:process.argv[3],version:result.version,status:result.status,score:result.score}));}
else if(command==='validate')console.log(JSON.stringify(applyDecisions(process.argv[3],true)));
else if(command==='apply')console.log(JSON.stringify(applyDecisions(process.argv[3])));
else if(command==='verify-published')console.log(JSON.stringify(await verifyPublished(process.argv[3],process.argv[4])));
else if(command==='status'){const manifest=read();console.log(JSON.stringify(manifest.items.map(item=>({id:item.id,original:item.original,versions:item.versions.map(candidate=>({version:candidate.version,status:candidate.status,score:candidate.score}))})),null,2));}

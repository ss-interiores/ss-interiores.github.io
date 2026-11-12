import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {root,reviewDir} from './photo-review.mjs';

const destination=process.argv[2];
if(!destination||!path.isAbsolute(destination))throw Error('Explicit absolute output directory required');
const manifest=JSON.parse(fs.readFileSync(path.join(reviewDir,'manifest.json'),'utf8'));
const previews=JSON.parse(fs.readFileSync(path.join(reviewDir,'previews/data.json'),'utf8').replace(/^\uFEFF/,''));
const notes={
  'IMG-01':'O tecido e a madeira ainda têm regularidade excessiva em alguns trechos, reduzindo a naturalidade ao ampliar; refinar microtextura sem reintroduzir manchas no xadrez.',
  'IMG-02':'Veios e dobras ainda parecem muito uniformes em alguns trechos, deixando sinais de modelagem; refinar a resposta física dos materiais sem alterar padrões e geometria.',
  'IMG-03':'A madeira ainda apresenta veios repetitivos e o tecido mantém dobras muito regulares, revelando a geração; variar somente microtextura e contato físico.',
  'IMG-04':'Alguns impressos ainda mostram letras reconstruídas, comprometendo a fidelidade dos detalhes; preservar as capas e quadros originais mantendo as correções de barbante e palha.',
  'IMG-06':'O brinquedo desfocado e pequenos impressos ainda têm definição reinterpretada, limitando a fidelidade em alta; conservar o contorno e a suavidade dos detalhes originais.',
  'IMG-07':'Pequenos impressos ainda têm letras reconstruídas e a madeira é muito regular, revelando a geração; preservar os gráficos e refinar apenas material e luz.',
  'IMG-09':'A trama e os veios ainda têm contraste forte e repetição, deixando aspecto de render ao ampliar; suavizar o contraste e refinar a escala sem mudar o desenho.',
  'IMG-10':'O tampo e algumas tramas ainda têm brilho e repetição muito uniformes, reduzindo a leitura fotográfica; refinar rugosidade e profundidade sem alterar a marcenaria.',
  'IMG-11':'Algumas bordas e áreas de palha continuam regulares demais, deixando aparência digital; refinar encontros e sombras da trama preservando sua escala.',
  'IMG-12':'A paisagem e pequenos livros têm detalhes reinterpretados a partir da baixa definição, limitando a fidelidade; manter a silhueta e evitar completar informação não visível.',
  'IMG-13':'O tampo ainda tem rugosidade pontilhada excessiva e alguns materiais são muito regulares, denunciando a geração; suavizar o acabamento e calibrar os reflexos.',
  'IMG-14':'Os cestos e pequenos impressos ainda repetem detalhes e apresentam letras imprecisas, reduzindo a naturalidade; preservar os gráficos e refinar a textura dos materiais.',
  'IMG-15':'O couro e a palha ainda têm brilho e contraste elevados, deixando aparência artificial em detalhes; reduzir o brilho e ajustar a resposta dos materiais à luz.',
  'IMG-16':'Madeira e palha ainda repetem detalhes de forma rígida, mantendo sinais de render; refinar microtextura e contato preservando a pintura lisa.',
  'IMG-17':'Os veios e a trama continuam muito regulares e contrastados, reduzindo o realismo ao ampliar; calibrar rugosidade e profundidade dos materiais.',
  'IMG-18':'O couro e a transparência da cortina ainda parecem excessivamente marcados em detalhes, denunciando a geração; suavizar a microtextura e equilibrar os reflexos.',
  'IMG-19':'O brilho das poltronas e algumas sombras ainda deixam os materiais artificiais, limitando a aparência fotográfica; calibrar rugosidade e exposição local.',
  'IMG-20':'Couro, palha e reflexos ainda têm regularidade e contraste elevados, deixando sinais de geração; refinar textura e resposta da luz sem alterar os elementos.',
  'IMG-21':'A pedra e a madeira ainda têm textura interpretada e contrastada, reduzindo a fidelidade dos acabamentos; aproximar a granulação do original mantendo a tampa aberta da churrasqueira.',
  'IMG-23':'Água e pedra ainda mostram reflexos e granulação pouco naturais em detalhes, denunciando o render; refinar ondulações, reflexos e escala do acabamento.',
  'IMG-24':'A repetição da microtextura da viga e a uniformidade da cerâmica ainda reduzem o realismo ao ampliar; refinar variação e contraste dos materiais preservando os encaixes corrigidos.',
  'IMG-25':'A vegetação e alguns reflexos ainda têm acabamento muito regular, mantendo sinais digitais; refinar geometria local e reflexão sem alterar a tela da TV.',
  'IMG-26':'Os veios ainda se repetem e a pedra tem definição reinterpretada, deixando sinais de render; refinar materiais preservando o céu sem elementos novos.',
  'IMG-27A':'Microdetalhes dos jogadores e equipamentos são reconstruídos de uma fonte pequena, limitando a fidelidade; preservar seus contornos e refinar somente o que é visível.',
  'IMG-27B':'Detalhes atrás do ripado e o tecido do pufe foram reconstruídos de uma fonte pequena, reduzindo a precisão; conservar os contornos visíveis e evitar novas peças.',
  'IMG-27C':'Pequenos componentes e texturas foram reconstruídos a partir de baixa definição, limitando a fidelidade; preservar equipamentos e melhorar apenas luz e material visíveis.',
};
const prefix={'quarto-antonio-catarina':'AC','quarto-gabi-juju':'GJ','sala-estar-jantar-jessica-gabriel':'SJ','cobertura-gourmet-jessica-gabriel':'CG','area-gourmet-apto-401':'AG'};
const images=manifest.items.map(item=>{
  const candidate=[...item.versions].reverse().find(candidate=>candidate.fidelity&&['pending','approved','published'].includes(candidate.status));
  assert.ok(candidate,'Missing review candidate: '+item.id);
  for(const [file,hash] of [[item.original,item.originalHash],[candidate.file,candidate.hash]])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),hash);
  for(const side of ['before','after'])assert.ok(/^data:image\/jpeg;base64,\/9j\//.test(previews[item.id]?.[side]??''),'Invalid preview: '+item.id+' '+side);
  return {id:item.id,project:item.project,view:item.view,short:prefix[item.slug]+' '+item.view,width:item.width,height:item.height,originalScore:item.originalScore,critique:item.critique,score:candidate.score,version:candidate.version,hash:candidate.hash,status:candidate.status,afterCritique:candidate.score<5?candidate.reviewCritique??notes[item.id]??candidate.qaNotes:'',...previews[item.id]};
});
assert.equal(images.length,29);
const data=JSON.stringify({schemaVersion:1,images}).replaceAll('<','\\u003c');
const template=fs.readFileSync(path.join(root,'scripts/photo-review-panel.html'),'utf8');
const fragment=template.replace('__PHOTO_REVIEW_DATA__',data);
assert.ok(Buffer.byteLength(fragment)<1000000,`Panel is ${Buffer.byteLength(fragment)} bytes; reduce preview size or quality`);
assert.ok(!/<!doctype|<html|<head>|<body>/i.test(fragment));
fs.mkdirSync(destination,{recursive:true});
const file=path.join(destination,'tier-list-revisao-fotografica.html');fs.writeFileSync(file,fragment);
fs.writeFileSync(path.join(reviewDir,'review-summary.json'),JSON.stringify({images:images.map(({before,after,...item})=>item),generations:manifest.items.reduce((sum,item)=>sum+item.versions.length,0)},null,2));
console.log(JSON.stringify({path:file,bytes:Buffer.byteLength(fragment),images:images.length,generations:manifest.items.reduce((sum,item)=>sum+item.versions.length,0)}));

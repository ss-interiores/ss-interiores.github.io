import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {root,reviewDir,validateDecisions} from './photo-review.mjs';

const readManifest=()=>JSON.parse(fs.readFileSync(path.join(reviewDir,'manifest.json'),'utf8'));
const fingerprint=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export function reviewCatalog(manifest=readManifest()) {
  return manifest.items.flatMap(item=>{
    const candidate=[...item.versions].reverse().find(version=>version.fidelity&&['pending','approved','published'].includes(version.status));
    if(!candidate)return [];
    return {id:item.id,project:item.project,view:item.view,slug:item.slug,version:candidate.version,hash:candidate.hash,score:candidate.score,originalScore:item.originalScore,critique:item.critique,qaNotes:candidate.qaNotes,afterCritique:candidate.reviewCritique??candidate.qaNotes,status:candidate.status,
      before:`/assets/${item.id}/${candidate.version}/before`,after:`/assets/${item.id}/${candidate.version}/after`};
  });
}
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
async function body(req){let data='';for await(const chunk of req){data+=chunk;if(Buffer.byteLength(data)>65536)throw Error('Lote muito grande');}return JSON.parse(data);}
function writeJson(file,data){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.new',JSON.stringify(data,null,2)+'\n');fs.renameSync(file+'.new',file);}
export function saveReviewState(payload,manifest=readManifest()) {
  // Selections are drafts. Saving them never prepares public assets.
  const selections=validateDecisions(manifest,payload);
  const catalog=reviewCatalog(manifest);
  const selectedId=catalog.some(item=>item.id===payload.selectedId)?payload.selectedId:'IMG-24';
  return {schemaVersion:1,selectedId,decisions:selections.map(({decision})=>decision)};
}
export function submitReviewBatch(payload,{manifest=readManifest(),directory=path.join(reviewDir,'inbox')}={}) {
  validateDecisions(manifest,payload);
  const decisions=payload.decisions.filter(decision=>decision.decision!=='pending');
  if(!decisions.length)throw Error('Escolha ao menos uma imagem para aprovar ou refazer');
  const exact={schemaVersion:1,decisions};
  const signature=crypto.createHash('sha256').update(JSON.stringify(exact)).digest('hex');
  const latestFile=path.join(directory,'latest.json');
  if(fs.existsSync(latestFile)){
    const latest=JSON.parse(fs.readFileSync(latestFile,'utf8'));
    if(latest.signature===signature&&fs.existsSync(path.join(directory,latest.id+'.json')))return latest;
  }
  const id=new Date().toISOString().replace(/[:.]/g,'-')+'-'+signature.slice(0,8);
  const submittedAt=new Date().toISOString();
  writeJson(path.join(directory,id+'.json'),exact);
  const receipt={id,signature,submittedAt,count:decisions.length,status:'submitted',file:`outputs/photo-review/inbox/${id}.json`};
  writeJson(latestFile,receipt);
  return receipt;
}
export function createReviewServer({dataDirectory=reviewDir}={}){
  return http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    try{
      const address=new URL(req.url,'http://127.0.0.1');
      if(!['127.0.0.1','localhost'].includes((req.headers.host??'').split(':')[0]))return json(res,403,{error:'Host inválido'});
      if(req.method==='GET'&&address.pathname==='/'){
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'"});
        return res.end(fs.readFileSync(path.join(root,'scripts/photo-review-viewer.html')));
      }
      if(req.method==='GET'&&address.pathname==='/api/catalog')return json(res,200,{schemaVersion:1,images:reviewCatalog()});
      if(req.method==='GET'&&address.pathname==='/api/state'){
        const file=path.join(dataDirectory,'viewer-state.json');
        return json(res,200,fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{schemaVersion:1,decisions:[]});
      }
      const asset=address.pathname.match(/^\/assets\/(IMG-\d{2}[A-C]?)\/(\d+)\/(before|after)$/);
      if(req.method==='GET'&&asset){
        const item=readManifest().items.find(item=>item.id===asset[1]);
        const candidate=item?.versions.find(version=>version.version===Number(asset[2]));
        if(!candidate?.fidelity||!['pending','approved','published'].includes(candidate.status))return json(res,404,{error:'Versão indisponível'});
        const file=path.join(root,asset[3]==='before'?item.original:candidate.file);
        const hash=asset[3]==='before'?item.originalHash:candidate.hash;
        if(fingerprint(file)!==hash)throw Error('Arquivo alterado desde a revisão');
        res.writeHead(200,{'Content-Type':'image/png','Cache-Control':'private, max-age=3600',ETag:`"${hash}"`});
        return fs.createReadStream(file).pipe(res);
      }
      if(['PUT','POST'].includes(req.method)){
        if(req.headers.origin!==`http://${req.headers.host}`||!req.headers['content-type']?.startsWith('application/json'))return json(res,403,{error:'Origem inválida'});
        if(req.method==='PUT'&&address.pathname==='/api/state'){
          const state=saveReviewState(await body(req));writeJson(path.join(dataDirectory,'viewer-state.json'),state);return json(res,200,{saved:true});
        }
        if(req.method==='POST'&&address.pathname==='/api/submit')return json(res,200,submitReviewBatch(await body(req),{directory:path.join(dataDirectory,'inbox')}));
      }
      return json(res,404,{error:'Não encontrado'});
    }catch(error){return json(res,400,{error:error.message});}
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PHOTO_REVIEW_PORT??43129);
  createReviewServer({dataDirectory:process.env.PHOTO_REVIEW_STATE_DIR??reviewDir}).listen(port,'127.0.0.1',()=>console.log(`Photo review: http://127.0.0.1:${port}`));
}

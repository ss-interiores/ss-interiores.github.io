import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {root,reviewDir} from './photo-review.mjs';
import {reviewCatalog,saveReviewState,submitReviewBatch} from './photo-review-server.mjs';

const manifest=JSON.parse(fs.readFileSync(path.join(reviewDir,'manifest.json'),'utf8'));
// Keep review-state fixtures independent from real user decisions and future versions.
for(const item of manifest.items){const valid=[...item.versions].reverse().find(version=>version.fidelity);item.versions=[{...valid,version:1,status:'rejected'},{...valid,version:2,status:'pending'},{...valid,version:3,status:'qa-rejected',fidelity:false}];}
const catalog=reviewCatalog(manifest);
const choice=(id,decision='pending')=>{const item=catalog.find(item=>item.id===id);return {id,version:item.version,hash:item.hash,decision,feedback:''};};
test('viewer uses full original PNG routes and the latest eligible version',()=>{
  assert.equal(catalog.length,29);const roof=catalog.find(item=>item.id==='IMG-24');
  assert.equal(roof.version,2);assert.equal(roof.before,'/assets/IMG-24/2/before');assert.equal(roof.after,'/assets/IMG-24/2/after');
});
test('images waiting for regeneration do not break the remaining review catalog',()=>{
  const waiting=structuredClone(manifest);waiting.items[0].versions.forEach(version=>version.status='rejected');
  assert.equal(reviewCatalog(waiting).length,28);
});
test('draft selection validates exact versions without changing candidate publication status',()=>{
  const initial=JSON.stringify(manifest);const state=saveReviewState({schemaVersion:1,selectedId:'IMG-24',decisions:[choice('IMG-24','approve')]},manifest);
  assert.equal(state.decisions[0].decision,'approve');assert.equal(JSON.stringify(manifest),initial);
  assert.throws(()=>saveReviewState({schemaVersion:1,decisions:[{...choice('IMG-24'),version:1}]},manifest));
});
test('explicit submission writes an exact, deduplicated batch and leaves public assets untouched',()=>{
  const directory=fs.mkdtempSync(path.join(root,'tmp/ss-photo-inbox-'));
  try{
    const initial=JSON.stringify(manifest);const payload={schemaVersion:1,decisions:[choice('IMG-24','redo'),choice('IMG-01')]};
    const receipt=submitReviewBatch(payload,{manifest,directory});const repeated=submitReviewBatch(payload,{manifest,directory});
    assert.equal(receipt.id,repeated.id);assert.equal(receipt.status,'submitted');
    const saved=JSON.parse(fs.readFileSync(path.join(directory,receipt.id+'.json'),'utf8'));
    assert.deepEqual(saved,{schemaVersion:1,decisions:[choice('IMG-24','redo')]});assert.equal(JSON.stringify(manifest),initial);
    assert.throws(()=>submitReviewBatch({schemaVersion:1,decisions:[choice('IMG-01')]},{manifest,directory}));
    assert.throws(()=>submitReviewBatch({schemaVersion:1,decisions:[{...choice('IMG-24','approve'),hash:'wrong'}]},{manifest,directory}));
  }finally{for(const file of fs.readdirSync(directory))fs.unlinkSync(path.join(directory,file));fs.rmdirSync(directory);}
});

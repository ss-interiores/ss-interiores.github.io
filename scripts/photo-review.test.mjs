import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDecisions } from './photo-review.mjs';

function fixture() {
  const candidate={version:1,status:'pending',fidelity:true,hash:'candidate-hash',file:'candidate.png'};
  const item={id:'IMG-01',original:'original.png',originalHash:'original-hash',versions:[candidate]};
  const payload={schemaVersion:1,decisions:[{id:'IMG-01',version:1,hash:'candidate-hash',decision:'approve',feedback:''}]};
  const hashOf=file=>file==='original.png'?'original-hash':'candidate-hash';
  return {manifest:{items:[item]},payload,hashOf,item,candidate};
}

test('approval is bound to the inspected version and file fingerprint',()=>{
  const f=fixture();const result=validateDecisions(f.manifest,f.payload,f.hashOf);
  assert.equal(result[0].candidate,f.candidate);
  assert.equal(f.candidate.status,'pending');
});
test('a whole batch is rejected for unknown or duplicate image IDs',()=>{
  const f=fixture();f.payload.decisions.push({...f.payload.decisions[0]});
  assert.throws(()=>validateDecisions(f.manifest,f.payload,f.hashOf),/Duplicate/);
  f.payload.decisions=[{...f.payload.decisions[0],id:'unknown'}];
  assert.throws(()=>validateDecisions(f.manifest,f.payload,f.hashOf),/QA/);
});
test('rejected and uninspected generations cannot be published',()=>{
  for(const status of ['generating','awaiting-qa','qa-rejected','rejected']){
    const f=fixture();f.candidate.status=status;
    assert.throws(()=>validateDecisions(f.manifest,f.payload,f.hashOf),/QA/);
  }
  const f=fixture();f.candidate.fidelity=false;
  assert.throws(()=>validateDecisions(f.manifest,f.payload,f.hashOf),/QA/);
});
test('a newer review version invalidates stale selections',()=>{
  const f=fixture();f.item.versions.push({...f.candidate,version:2});
  assert.throws(()=>validateDecisions(f.manifest,f.payload,f.hashOf),/Stale/);
});
test('changed candidate, original, or supplied hash invalidates approval',()=>{
  for(const changed of ['candidate.png','original.png']){
    const f=fixture();assert.throws(()=>validateDecisions(f.manifest,f.payload,file=>file===changed?'modified':f.hashOf(file)),/fingerprint/);
  }
  const f=fixture();f.payload.decisions[0].hash='different';
  assert.throws(()=>validateDecisions(f.manifest,f.payload,f.hashOf),/fingerprint/);
});
test('pending and redo choices stay distinct from approval',()=>{
  const f=fixture();for(const value of ['pending','redo']){f.payload.decisions[0].decision=value;assert.equal(validateDecisions(f.manifest,f.payload,f.hashOf)[0].decision.decision,value);}
});

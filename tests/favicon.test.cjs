const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('default browser favicon is a valid ICO with the existing app PNG',()=>{
 const icon=fs.readFileSync(require.resolve('../public/favicon.ico'));
 assert.equal(icon.readUInt16LE(0),0);assert.equal(icon.readUInt16LE(2),1);assert.equal(icon.readUInt16LE(4),1);
 const length=icon.readUInt32LE(14),offset=icon.readUInt32LE(18);
 assert.equal(offset,22);assert.equal(offset+length,icon.length);
 assert.deepEqual([...icon.subarray(offset,offset+8)],[137,80,78,71,13,10,26,10]);
 assert.equal(icon[offset+16+3],48);
});

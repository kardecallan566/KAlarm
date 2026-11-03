const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const m=JSON.parse(fs.readFileSync(path.join(root,'assets/softcare/manifest.json'),'utf8'));
const groups=new Set(m.map(x=>x.group));
if(m.length!==30||new Set(m.map(x=>x.name)).size!==30||groups.size!==6){
  throw new Error('Manifest: expected 30 unique icons in 6 groups');
}
for(const item of m){
  const filepath=path.resolve(root,item.path);
  const data=fs.readFileSync(filepath);
  const isPNG=data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if(!isPNG)throw new Error(`Not PNG: ${item.name}`);
  const size=[data.readUInt32BE(16),data.readUInt32BE(20)];
  if(size[0]!==256||size[1]!==256) throw new Error(`Incorrect dimensions: ${item.name} ${size}`);
  const sha=crypto.createHash('sha256').update(data).digest('hex');
  if(item.sha256!==sha)throw new Error(`SHA mismatch: ${item.name}`);
}
const required=['icon.png','adaptive-icon.png','adaptive-icon-monochrome.png','brandmark.png','splash.png','play-store-512.png'];
for(const file of required)if(!fs.existsSync(path.join(root,'assets',file)))throw new Error(`Missing ${file}`);
const src=fs.readFileSync(path.join(root,'src/components/icons/SoftCareIcon.tsx'),'utf8');
for(const item of m)if(!src.includes(`icons/${item.name}.png`))throw new Error(`Missing Metro reference ${item.name}`);
console.log(`PASS: ${m.length} distinct PNG icons, ${groups.size} groups, validated SHA256, sizes, and Metro requires.`);

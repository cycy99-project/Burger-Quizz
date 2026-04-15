const fs=require('fs');
const text=fs.readFileSync('js/questions.js','utf8');
const key='niveau_4:';
const idx=text.indexOf(key);
if(idx<0){console.error('no niveau_4'); process.exit(1);}
let start=text.indexOf('[', idx);
let depth=0; let i=start;
for(i=start;i<text.length;i++){
  if(text[i]=='[') depth++;
  else if(text[i]==']'){
    depth--;
    if(depth===0) break;
  }
}
const slice=text.slice(start+1,i);
// now extract objects with fr and theme
const entryRe=/\{([\s\S]*?)\}/g;
let m; let count=0; const counts={};
while((m=entryRe.exec(slice))){
  const obj=m[1];
  const frMatch=obj.match(/fr:\s*"([^"]*)"/);
  const themeMatch=obj.match(/theme:\s*"([^"]*)"/);
  if(frMatch && themeMatch){
    count++; const fr=frMatch[1].replace(/\s+/g,' ').trim(); const theme=themeMatch[1];
    console.log(count+' | '+theme+' | '+fr);
    counts[theme]=(counts[theme]||0)+1;
  }
}
console.log('\nTOTAL:',count); console.log('BY THEME:',counts);

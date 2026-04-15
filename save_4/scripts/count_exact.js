const fs=require('fs');
const text=fs.readFileSync('js/questions.js','utf8');
function sliceByKey(name){
  const idx=text.indexOf(name+': ['); if(idx<0) return null;
  let start=text.indexOf('[',idx);
  let depth=0; let i=start;
  for(i=start;i<text.length;i++){
    if(text[i]=='[') depth++;
    else if(text[i]==']'){
      depth--; if(depth===0) break;
    }
  }
  return text.slice(start+1,i);
}
function analyze(slice){
  const entryRe=/\{([\s\S]*?)\}/g; let m; let total=0; const themes={}; const choices=[];
  while((m=entryRe.exec(slice))){
    const obj=m[1];
    const frMatch=obj.match(/fr:\s*"([^"]*)"/);
    const themeMatch=obj.match(/theme:\s*"([^"]*)"/);
    const cfMatch=obj.match(/choices_fr\s*:\s*\[([^\]]*)\]/);
    if(frMatch && themeMatch){ total++; themes[themeMatch[1]]=(themes[themeMatch[1]]||0)+1; }
    if(cfMatch){ choices.push((cfMatch[1].match(/"(.*?)"/g)||[]).length); }
  }
  return {total, themes, choices_counts: choices};
}
const levels=['niveau_1','niveau_2','niveau_3','niveau_4'];
const out={}; levels.forEach(l=>{ const s=sliceByKey(l); out[l]=s? analyze(s): null; });
console.log(JSON.stringify(out,null,2));

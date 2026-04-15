const fs=require('fs');
const text=fs.readFileSync('js/questions.js','utf8');
function parseLevel(name){
  const idx=text.indexOf(name+': [');
  if(idx<0) return null;
  const start=text.indexOf('[',idx);
  let depth=0;
  let i=start+1;
  for(;i<text.length;i++){
    if(text[i]=='[') depth++;
    else if(text[i]==']'){
      if(depth==0) break; else depth--;
    }
  }
  const slice=text.slice(start+1,i);
  const total=(slice.match(/\{\s*fr:/g)||[]).length;
  const themes={};
  const themeRe=/theme:\s*"([^"]+)"/g;
  let m;
  while((m=themeRe.exec(slice))){
    themes[m[1]]=(themes[m[1]]||0)+1;
  }
  const choiceBlocks=[];
  const cfRe=/choices_fr\s*:\s*\[([^\]]*)\]/g;
  while((m=cfRe.exec(slice))){
    const items=(m[1].match(/"(.*?)"/g)||[]).length;
    choiceBlocks.push(items);
  }
  return {total, themes, choices_counts: choiceBlocks};
}
const levels=['niveau_1','niveau_2','niveau_3','niveau_4'];
const out={};
levels.forEach(l=>{ out[l]=parseLevel(l); });
console.log(JSON.stringify(out,null,2));

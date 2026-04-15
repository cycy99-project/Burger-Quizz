const fs=require('fs');
const text=fs.readFileSync('js/questions.js','utf8');
function parseLevel(name,nextName){
  const a=text.indexOf(name+': [');
  if(a<0) return null;
  const start=text.indexOf('[',a);
  let end;
  if(nextName){
    const b=text.indexOf(nextName+':',start);
    if(b<0) end=text.indexOf(']',start);
    else end=b;
  } else {
    // last level: find the closing ] followed by \n};
    const b=text.indexOf('\n];',start);
    end = b>0? b : text.lastIndexOf(']');
  }
  const slice=text.slice(start+1,end);
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
const out={};
out.niveau_1=parseLevel('niveau_1','niveau_2');
out.niveau_2=parseLevel('niveau_2','niveau_3');
out.niveau_3=parseLevel('niveau_3','niveau_4');
out.niveau_4=parseLevel('niveau_4',null);
console.log(JSON.stringify(out,null,2));

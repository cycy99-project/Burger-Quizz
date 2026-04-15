const fs=require('fs');
const text=fs.readFileSync('js/questions.js','utf8');
function sliceLevel(name,nextName){
  const a=text.indexOf(name+': [');
  if(a<0) return null;
  const start=text.indexOf('[',a);
  let end;
  if(nextName){
    const b=text.indexOf(nextName+':',start);
    end = b>0 ? b : text.indexOf(']',start);
  } else {
    const b=text.indexOf('\n];',start);
    end = b>0 ? b : text.lastIndexOf(']');
  }
  return text.slice(start+1,end);
}
const slice = sliceLevel('niveau_4',null);
if(!slice){ console.error('niveau_4 not found'); process.exit(1); }
const entryRe=/\{[^}]*?fr:\s*"([^"]*)"[^}]*?theme:\s*"([^"]*)"[^}]*?\}/gs;
let m; let i=0; const counts={};
while((m=entryRe.exec(slice))){ i++; const fr=m[1].replace(/\s+/g,' ').trim(); const theme=m[2]; console.log(i+' | '+theme+' | '+fr); counts[theme]=(counts[theme]||0)+1; }
console.log('\nTOTAL:',i); console.log('BY THEME:',counts);

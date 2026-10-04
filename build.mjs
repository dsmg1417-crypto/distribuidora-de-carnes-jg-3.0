import {cp,mkdir,readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=process.cwd();
const source=root;
const images=(await readdir(root)).filter(file=>/\.(?:webp|png)$/i.test(file));
const siteFiles=['index.html','styles.css','cooking.css','app.js','combos.js','cooking.js','cart.js','menu.js',...images];
for(const file of ['app.js','combos.js','cooking.js','cart.js','menu.js'])new vm.Script(await readFile(path.join(source,file),'utf8'),{filename:file});
const sandbox={window:{}};
vm.runInNewContext(await readFile(path.join(source,'combos.js'),'utf8'),sandbox);
const combos=sandbox.window.JG_COMBOS;
if(combos.length!==8||new Set(combos.map(c=>c.id)).size!==8)throw new Error('El catálogo debe tener ocho combos únicos.');
for(const combo of combos){if(!combo.items.length)throw new Error(`Combo vacío: ${combo.name}`);await stat(path.join(source,`${combo.image}.webp`));}
const html=await readFile(path.join(source,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!match[1].includes(':'))await stat(path.join(source,match[1].split('?')[0]));}
await mkdir(path.join(root,'dist'),{recursive:true});
for(const file of siteFiles)await cp(path.join(source,file),path.join(root,'dist',file),{recursive:true});
console.log(`Web preparada: ${combos.length} combos, ${images.length} imágenes locales. Salida: dist.`);


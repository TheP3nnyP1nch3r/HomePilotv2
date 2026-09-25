/* Integration uses the original app's state and save/sync functions. */
const PX=QuestPixel;
let pixelFilter='outfit',pixelOpening=false,pixelDeferred=false;
const pixelAsset=(id,sex)=>'assets/pixel/'+(PX.get(id)?.slot==='outfit'?(sex||S.pixel.sex)+'-':'')+(PX.get(id)?.asset||id)+'.png';
function pixelState(){return PX.migrate(S,level().l,ACTIVE_PROFILE==='kk'?'female':'male')}
function pixelFigure(p=pixelState(),pets=true){
 const e=p.equipped,sex=p.sex==='female'?'female':'male',outfit=PX.get(e.outfit)?.slot==='outfit'?e.outfit:'trailkeeper';
 const src=pixelAsset(outfit,sex),female=sex==='female';
 const hand={ranger:[female?135:130,female?278:296, female?279:278,female?287:307],knight:[female?133:128,female?274:297,female?272:279,female?285:305],battlemage:[female?128:128,female?279:296,female?274:277,female?289:308],trailkeeper:[female?131:128,female?279:296,female?279:279,female?293:308],duskwarden:[female?131:128,female?279:296,female?279:279,female?293:308],frostguard:[female?131:128,female?279:296,female?279:279,female?293:308],ironbound:[female?131:128,female?279:296,female?279:279,female?293:308],stormcaller:[female?131:128,female?279:296,female?279:279,female?293:308],sunstrider:[female?131:128,female?279:296,female?279:279,female?293:308],wayfarer:[female?131:128,female?279:296,female?279:279,female?293:308],tideguard:[female?131:128,female?279:296,female?279:279,female?293:308],mossguard:[female?131:128,female?279:296,female?279:279,female?293:308]}[outfit];
 const img=(id,x,y,w,h,cl='',rotation=0,pivot=[.5,.5])=>`<img class="pixel-item ${cl}" src="${pixelAsset(id,sex)}" alt="" style="left:${x/384*100}%;top:${y/512*100}%;width:${w/384*100}%;height:${h/512*100}%;transform-origin:${pivot[0]*100}% ${pivot[1]*100}%;transform:rotate(calc(${rotation}deg + var(--lag,0deg)))">`;
 let layers='';
 const main=PX.get(e.main);
 if(main){const spec={sword:[82,211,.30,.90,70],saber:[64,210,.30,.82,-145],axe:[124,222,.50,.84,70],hammer:[125,212,.50,.84,70],bow:[88,264,.25,.50,-10],staff:[75,270,.5,.79,0],spear:[43,278,.5,.77,0],paddle:[90,170,.50,.83,70],rake:[90,204,.50,.15],dustpan:[103,197,.50,.15],
   longsword2:[127,211,.30,.90,70],warhammer2:[147,220,.50,.84,70],longbow2:[118,230,.15,.50,-30],halberd2:[158,240,.5,.77,0],plumsaber2:[102,200,.30,.82,-145],battleaxe2:[141,215,.50,.84,70],tidestaff2:[134,230,.5,.79,0],mace2:[112,190,.50,.84,70],mtnspear2:[126,260,.5,.77,0],dagger2:[86,140,.30,.90,70],ravenscythe:[158,250,.5,.77,0],shellscythe:[164,250,.5,.77,0]
  }[main.asset]||[78,224,.5,.84];
 const [w,h,px,py,rotation=0]=spec;layers+=img(main.id,hand[0]-w*px,hand[1]-h*py,w,h,'pixel-weapon '+(main.special?'pixel-special':''),rotation,[px,py]);}
 
 // Put the original clenched hand pixels back in front of the held layers.
 if(main&&['ranger','knight','battlemage','trailkeeper'].includes(outfit)){const [x,y]=[hand[0],hand[1]];layers+=`<img class="pixel-base" src="${src}" alt="" style="z-index:4;clip-path:inset(${(y-10)/512*100}% ${(384-x-13)/384*100}% ${(512-y-11)/512*100}% ${(x-13)/384*100}%)">`}
 if(e.head){const hs={cap:[139,33,110,80],hood:[133,18,124,159],circlet:[159,66,86,36],helmet:[128,4,131,149],hat:[123,-1,154,118],goggles:[145,29,111,136]}[e.head];if(hs)layers+=img(e.head,...hs)}
 const pet=PX.get(e.pet);
 const petGrown=pet&&['dragon','wolf','fox','griffin','owlbear','phoenix'].includes(pet.id)&&(typeof level==='function'?level().l:0)>=10;
 const petSrc=pet?(petGrown?'assets/pixel/'+pet.id+'-adult.png':pixelAsset(pet.id)):'';
 return `<div class="pixel-figure" role="img" aria-label="${sex} ${outfit}${main?', '+main.name:''}${pet&&pets?', with '+(petGrown?'grown ':'')+pet.name:''}"><div class="pixel-rig"><img class="pixel-base" src="${src}" alt="">${layers}</div>${pet&&pets?`<img class="pixel-pet${petGrown?' pixel-pet-grown':''}" src="${petSrc}" alt="">`:''}</div>`;
}
function pixelCheer(special=false){document.body.classList.remove('pixel-cheer');void document.body.offsetWidth;document.body.classList.add('pixel-cheer');if(special)document.body.classList.add('pixel-milestone');clearTimeout(pixelCheer.timer);pixelCheer.timer=setTimeout(()=>document.body.classList.remove('pixel-cheer','pixel-milestone'),1600)}
async function pixelBackup(raw){
 if(JSON.parse(raw)?.pixel)return;
 try{await window.storage.get(KEY+':pre-pixel-v5')}catch(e){await window.storage.set(KEY+':pre-pixel-v5',raw)}
}
function pixelDownload(value,name){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([value],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function pixelOnLevels(before,after){
 const p=pixelState();
 for(let l=before+1;l<=after;l++)if(l%10===0&&!p.classQueue.includes(l))p.classQueue.push(l);
 if(!S.pendingClass&&p.classQueue.length)S.pendingClass=p.classQueue.shift();
}
async function pixelNext(){
 if(!S||pixelOpening||pixelDeferred||el('loot').classList.contains('on'))return;
 if(S.pending){showLoot();return}if(S.pending3d){showLoot3d();return}if(S.pendingClass){showClassPick();return}
 const p=pixelState();
 if(p.classQueue.length){S.pendingClass=p.classQueue.shift();await save();showClassPick();return}
 const q=PX.prepare(p);if(!q)return;
 pixelOpening=true;
 // Persist the exact offered IDs before the player can see or select them.
 if(!await save()){pixelOpening=false;return}
 el('lootlv').textContent=q.level===10?'Level 10 · A promise kept':'Level '+q.level;
 el('lootsub').textContent=PX.slotAt(q.level)==='pet'?'Choose a traveling companion. Owned companions can be swapped freely.':q.level===10?'Choose a gold-lit keepsake. Your first ten levels deserve a celebration.':'Choose a keepsake for the road. It stays yours.';
 el('lootcards').innerHTML=q.choices.map(id=>{const i=PX.get(id);return `<button class="pixel-loot" data-pixel-choice="${id}"><img src="${pixelAsset(id)}" alt=""><b>${i.name}</b><small>${i.special?'Level 10 keepsake':PX.slots[i.slot]} · cosmetic</small></button>`}).join('');
 el('lootcards').querySelectorAll('button').forEach(b=>b.onclick=async()=>{
  if(!PX.claim(p,b.dataset.pixelChoice))return;
  UNDO=null;S.log.unshift('Collected — '+PX.get(b.dataset.pixelChoice).name);el('loot').classList.remove('on');render();await save();pixelCheer(q.level===10);confetti(q.level===10?140:55,'center');setTimeout(pixelNext,350);
 });
 el('lootcards').insertAdjacentHTML('beforeend','<button class="ghost" id="pixel-later" style="grid-column:1/-1">Choose later</button>');el('pixel-later').onclick=()=>{pixelDeferred=true;el('loot').classList.remove('on');el('equipment-drawer')?.querySelector('summary')?.focus()};
 el('loot').classList.add('on');pixelOpening=false;el('lootcards').querySelector('button')?.focus();
}
function pixelRender(){
 const p=pixelState();
 el('pixelstage').innerHTML=pixelFigure(p);
 const vit=S.vitality??100,rig=el('pixelstage').querySelector('.pixel-rig');
 if(rig){rig.style.animationDuration=(3.6+(100-vit)/100*3.2).toFixed(2)+'s';
   rig.style.opacity=vit<40?'.94':'1'}
 el('fig').innerHTML=pixelFigure(p,false);el('fig2').innerHTML=pixelFigure(p,false);
 const [,label,col]=condition();el('cond').innerHTML=`<span style="color:${col};font-weight:600">${label}</span> · <span id="vitLabel" style="text-decoration:underline dotted;cursor:pointer">character vitality ${Math.round(S.vitality??100)}</span>`;
 const vitEl=document.getElementById('vitLabel');
 if(vitEl)vitEl.onclick=()=>toast('A game mechanic based on logged activity — not a measure of your health or worth.');
 document.querySelector('.nm').textContent=ACTIVE_PROFILE==='kk'?'Kaitlyn / KK':'Ty Wiles';
 el('gear').innerHTML=`<p class="sub">Cosmetics are yours to keep. Outfits work across every gameplay class.</p><div class="pixel-controls"><label>Character <select id="pixel-sex"><option value="male" ${p.sex==='male'?'selected':''}>Male</option><option value="female" ${p.sex==='female'?'selected':''}>Female</option></select></label><label>Save profile <select id="pixel-profile"><option value="ty" ${ACTIVE_PROFILE==='ty'?'selected':''}>Ty</option><option value="kk" ${ACTIVE_PROFILE==='kk'?'selected':''}>Kaitlyn</option></select></label></div><h3>Collection book · ${p.owned.length} / ${PX.catalog.length}</h3><div class="collection-tabs">${Object.entries(PX.slots).map(([id,n])=>`<button data-pixel-filter="${id}" aria-pressed="${id===pixelFilter}">${n}</button>`).join('')}</div><div class="collection">${PX.catalog.filter(i=>i.slot===pixelFilter).map(i=>{const owned=p.owned.includes(i.id),worn=p.equipped[i.slot]===i.id;return `<button class="${owned?'':'locked'}" data-pixel-equip="${i.id}" ${owned?'':'disabled'} aria-pressed="${worn}"><img src="${pixelAsset(i.id)}" alt=""><span>${i.name}</span><small>${worn?'Equipped':owned?'Wear / equip':i.slot==='pet'?'Levels 3 · 13 · 23 · 33':i.special?'Level 10 reward':'Locked · level rewards'}</small></button>`}).join('')}</div><div class="pixel-controls"><button id="pixel-rewards">${p.queue.length?'Open rewards ('+p.queue.length+')':'Check rewards'}</button>${S.xp===0&&p.earnedThrough===1&&!p.starterChosen?'<button id="pixel-start">Choose starting class</button>':''}</div><p class="sub" style="margin-top:12px">Companions travel with you; KK and Lawson keep their own family bonds. Optional slots can be emptied by tapping the equipped item again.</p>`;
 el('pixel-sex').onchange=e=>{p.sex=e.target.value;render();save()};
 el('pixel-profile').onchange=async e=>{const next=e.target.value;await save();localStorage.setItem('liferpg:active-profile',next);location.reload()};
 el('pixel-rewards').onclick=()=>{pixelDeferred=false;pixelNext()};
 el('pixel-start')?.addEventListener('click',()=>{
  el('lootlv').textContent='Your first chapter';el('lootsub').textContent='Choose a gameplay class. Outfit changes later do not change your class.';
  el('lootcards').innerHTML=Object.entries(CLASSES).map(([id,c])=>`<button class="pixel-loot" data-start-class="${id}"><img src="${pixelAsset(PX.starters[id][0])}" alt=""><b>${c.n}</b></button>`).join('');
  el('lootcards').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.cls=b.dataset.startClass;p.starterChosen=true;if(!p.legacyOwned.length){p.owned=[];p.equipped={}}for(const id of PX.starters[S.cls]){if(!p.owned.includes(id))p.owned.push(id);p.equipped[PX.get(id).slot]=id}el('loot').classList.remove('on');render();save()});el('loot').classList.add('on');
 });
 el('gear').querySelectorAll('[data-pixel-filter]').forEach(b=>b.onclick=()=>{pixelFilter=b.dataset.pixelFilter;pixelRender()});
 el('gear').querySelectorAll('[data-pixel-equip]').forEach(b=>b.onclick=()=>{
   const item=PX.get(b.dataset.pixelEquip),wasPet=p.equipped.pet;
   if(PX.equip(p,b.dataset.pixelEquip)){render();save();
     if(item&&item.slot==='pet'&&p.equipped.pet&&p.equipped.pet!==wasPet&&!reduced){
       setTimeout(()=>{const pet=document.querySelector('#pixelstage .pixel-pet');if(pet)pet.classList.add('pixel-pet-arrive')},50);
     }}});
 if(p.legacyOwned.length){const names=p.legacyOwned.map(id=>ITEMS.find(i=>i.id===id)?.n||g3(id)?.[1]||id);
 el('gear').insertAdjacentHTML('beforeend',`<details class="pixel-legacy"><summary>Legacy keepsakes · ${names.length} preserved</summary><p class="sub">Original inventory remains in your save. Available matching designs are also unlocked in this collection; unmatched pieces are recorded here.</p><div>${names.map(n=>esc(n)).join(' · ')}</div></details>`)}
}
function pixelInstall(){
 for(const id of ['skinb','hairb','beardb'])el(id).hidden=true;
 el('fig2').parentElement.querySelector('.looks').innerHTML='<span class="sub">Choose your character and equipment in Hero → Collection book. Brown hair and light skin are part of this artwork.</span>';
 el('p-recent').querySelector('.row').insertAdjacentHTML('beforeend','<button class="ghost" id="pixel-backup">Download save</button><button class="ghost" id="pixel-original">Download pre-update backup</button>');
 el('pixel-backup').onclick=()=>pixelDownload(JSON.stringify(S,null,2),'tys-quest-'+ACTIVE_PROFILE+'-save.json');
 el('pixel-original').onclick=async()=>{try{const r=await window.storage.get(KEY+':pre-pixel-v5');pixelDownload(r.value,'tys-quest-'+ACTIVE_PROFILE+'-pre-v5.json')}catch(e){toast('No earlier save exists for this profile.')}};
 el('loot').addEventListener('keydown',e=>{if(e.key==='Escape'&&el('pixel-later')){el('pixel-later').click();return}if(e.key!=='Tab')return;const nodes=[...el('loot').querySelectorAll('button,[tabindex="0"]')],first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}});
 const observer=new MutationObserver(()=>{if(!el('loot').classList.contains('on'))setTimeout(pixelNext,400)});observer.observe(el('loot'),{attributes:true,attributeFilter:['class']});
}

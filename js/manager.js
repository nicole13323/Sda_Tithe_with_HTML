// Church leader / admin: reports, members, cash payments
function scope(){return S.u.role=='admin'?S.ch:S.u.church}
function mgr(){const sc=scope(),adm=S.u.role=='admin';
return`<div class=hero style="padding:22px 16px 46px"><h2 style="margin:0">${adm?t('ra'):t('rl')} · ${sc=='all'?t('all'):esc(sc)}</h2></div><div class=wrap style="margin-top:-30px">${adm?`<select onchange="S.ch=this.value;render()"><option value=all>${t('all')}</option>${chOpts(S.ch)}</select>`:''}
<div class=tabs>${(adm?[['ana','ana']]:[]).concat([['rep','rep'],['mem','mem'],['cash','cash']]).map(x=>`<button class="${S.v==x[0]?'on':''}" onclick="S.v='${x[0]}';render()">${t(x[1])}</button>`).join('')}</div>${S.v=='ana'?ana(sc):S.v=='rep'?rep(sc):S.v=='mem'?mem(sc):cash(sc)}</div>`}
function rep(sc){const now=new Date(),P=S.per,B=[];
if(P=='year')for(let m=1;m<=12;m++)B.push({k:now.getFullYear()+'-'+String(m).padStart(2,'0'),l:m,s:0});
else if(P=='month'){const n=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();for(let d=1;d<=n;d++){const k=fmt(new Date(now.getFullYear(),now.getMonth(),d));B.push({k,l:d,s:0})}}
else for(let d=6;d>=0;d--)B.push({k:ago(d),l:ago(d).slice(5),s:0});
const key=p=>P=='year'?p.date.slice(0,7):p.date,map={};B.forEach(b=>map[b.k]=b);
const per=db.P.filter(p=>(sc=='all'||p.ch==sc)&&map[key(p)]);per.forEach(p=>map[key(p)].s+=p.amt);
const tot=per.reduce((a,p)=>a+p.amt,0),mx=Math.max(1,...B.map(b=>b.s)),g={};per.forEach(p=>g[p.mid]=(g[p.mid]||0)+p.amt);
const nm=id=>(db.M.find(m=>m.id==id)||{}).name||'',bm={},bc={},cn={};
per.forEach(p=>{const a=bm[p.method]=bm[p.method]||{c:0,s:0};a.c++;a.s+=p.amt;const b=bc[p.ch]=bc[p.ch]||{c:0,s:0};b.c++;b.s+=p.amt;cn[p.mid]=(cn[p.mid]||0)+1});
const R=o=>Object.entries(o).sort((a,b)=>b[1].s-a[1].s).map(x=>`<tr><td>${esc(x[0])}</td><td>${x[1].c}</td><td><b>${rwf(x[1].s)}</b></td></tr>`).join('')+`<tr><th>${t('total')}</th><th>${per.length}</th><th>${rwf(tot)}</th></tr>`;
const T=(h,r)=>`<div class=tw><table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${r}</table></div>`;
const ms=db.M.filter(m=>m.role=='member'&&(sc=='all'||m.church==sc)).sort((a,b)=>(g[b.id]||0)-(g[a.id]||0));
const tx=[...per].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
return`<div class=tabs>${['week','month','year'].map(x=>`<button class="${P==x?'on':''}" onclick="S.per='${x}';render()">${t(x)}</button>`).join('')}</div>
<div class=stats><div class=stat><b>${rwf(tot)}</b><span>${t('total')}</span></div><div class=stat><b>${per.length}</b><span>${t('cnt')}</span></div><div class=stat><b>${per.length?rwf(Math.round(tot/per.length)):'0'}</b><span>Ø</span></div></div>
<div class=card><div class=bars>${B.map(b=>`<div class=bar title="${b.k}: ${rwf(b.s)}"><i style="height:${Math.round(b.s/mx*85)}%"></i>${b.l}</div>`).join('')}</div></div>
<div class=card><h3>📋 ${t('full')} — ${sc=='all'?t('all'):esc(sc)} (${t(P)})</h3><div class=np><button onclick=printRep()>🖨 ${t('print')}</button></div>
<h4>${t('bymeth')}</h4>${T([t('method'),t('cnt'),t('total')],R(bm))}
${sc=='all'?`<h4>${t('bych')}</h4>`+T([t('church'),t('cnt'),t('total')],R(bc)):''}
<h4>${t('bymem')} (${ms.length})</h4>${T([t('name'),t('church'),t('cnt'),t('total')],ms.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.church)}</td><td>${cn[m.id]||0}</td><td>${g[m.id]?`<b>${rwf(g[m.id])}</b>`:'—'}</td></tr>`).join(''))}
<h4>${t('alltx')} (${per.length})</h4>${T([t('date'),t('mbr'),t('church'),t('method'),t('by'),t('amount')],tx.map(p=>`<tr><td>${p.date}</td><td>${esc(nm(p.mid))}</td><td>${esc(p.ch)}</td><td>${p.method}</td><td>${esc(p.by||'—')}</td><td><b>${rwf(p.amt)}</b></td></tr>`).join(''))}</div>`}
function ana(sc){const now=new Date(),Y=now.getFullYear(),mk=(y,m)=>y+'-'+String(m).padStart(2,'0'),cm=mk(Y,now.getMonth()+1),pd=new Date(Y,now.getMonth()-1,1),lm=mk(pd.getFullYear(),pd.getMonth()+1);
const P=db.P.filter(p=>sc=='all'||p.ch==sc),ms=db.M.filter(m=>m.role=='member'&&(sc=='all'||m.church==sc));
const sum=a=>a.reduce((x,p)=>x+p.amt,0),yr=P.filter(p=>p.date.startsWith(Y+'')),mo=P.filter(p=>p.date.startsWith(cm)),pm=P.filter(p=>p.date.startsWith(lm));
const gr=sum(pm)?Math.round((sum(mo)-sum(pm))/sum(pm)*100):0,act=new Set(mo.map(p=>p.mid)).size,cut=ago(60),rec=new Set(P.filter(p=>p.date>=cut).map(p=>p.mid)),late=ms.filter(m=>!rec.has(m.id)).length;
const trend=[];for(let i=11;i>=0;i--){const d=new Date(Y,now.getMonth()-i,1),k=mk(d.getFullYear(),d.getMonth()+1);trend.push({k,l:d.getMonth()+1,s:sum(P.filter(p=>p.date.startsWith(k)))})}
const mx=Math.max(1,...trend.map(b=>b.s)),ty=sum(yr)||1,bm={};yr.forEach(p=>bm[p.method]=(bm[p.method]||0)+p.amt);
const hb=(l,v,max,x)=>`<div class=hb><span>${esc(l)}</span><div class=hbt><i style="width:${Math.round(v/max*100)}%"></i></div><b>${x}</b></div>`;
const rows=CH.map(c=>({c,n:ms.filter(m=>m.church==c).length,a:new Set(mo.filter(p=>p.ch==c).map(p=>p.mid)).size,y:sum(yr.filter(p=>p.ch==c))})).sort((a,b)=>b.y-a.y);
return`<div class=stats><div class=stat><b>${rwf(sum(yr))}</b><span>${t('yr')}</span></div>
<div class=stat><b>${rwf(sum(mo))}</b><span>${t('mon')} · <em class="${gr>=0?'up':'dn'}">${gr>=0?'▲':'▼'} ${Math.abs(gr)}% ${t('grow')}</em></span></div>
<div class=stat><b>${ms.length}</b><span>${t('mem')}</span></div>
<div class=stat><b>${act} (${ms.length?Math.round(act/ms.length*100):0}%)</b><span>${t('act')} · ${t('mon')}</span></div>
<div class=stat><b>${late}</b><span>${t('late')}</span></div>
<div class=stat><b>${rwf(Math.round(sum(yr)/(ms.length||1)))}</b><span>${t('avgm')}</span></div></div>
<div class=card><h3>📈 ${t('trend')}</h3><div class=bars>${trend.map(b=>`<div class=bar title="${b.k}: ${rwf(b.s)}"><i style="height:${Math.round(b.s/mx*85)}%"></i>${b.l}</div>`).join('')}</div></div>
<div class=g2><div class=card><h3>💳 ${t('share')}</h3>${Object.entries(bm).sort((a,b)=>b[1]-a[1]).map(x=>hb(x[0],x[1],ty,Math.round(x[1]/ty*100)+'%')).join('')}</div>
${sc=='all'?`<div class=card><h3>🏆 ${t('rank')}</h3>${rows.map(r=>hb(r.c,r.y,Math.max(1,rows[0].y),rwf(r.y))).join('')}</div>`:''}</div>
${sc=='all'?`<div class=card><h3>⛪ ${t('church')} · ${t('part')}</h3><div class=tw><table><tr><th>${t('church')}</th><th>${t('mem')}</th><th>${t('act')}</th><th>${t('part')}</th><th>${t('yr')}</th><th>${t('avgm')}</th></tr>${rows.map(r=>`<tr><td>${esc(r.c)}</td><td>${r.n}</td><td>${r.a}</td><td>${r.n?Math.round(r.a/r.n*100):0}%</td><td><b>${rwf(r.y)}</b></td><td>${rwf(Math.round(r.y/(r.n||1)))}</td></tr>`).join('')}</table></div></div>`:''}`}
function mem(sc){return`<div class=card><h3>${t('add')}</h3><div class=g2><div><label>${t('name')}</label><input id=n1></div><div><label>${t('phone')}</label><input id=n2 type=tel></div>${sc=='all'?`<div><label>${t('church')}</label><select id=n3>${chOpts()}</select></div>`:''}</div><button onclick="addM('${sc}')">${t('save')}</button><small>${t('pw')}</small></div><div class=card><input placeholder="${t('search')}" oninput="S.q=this.value;tbl()"><div id=mt></div></div>`}
function tbl(){const e=$('#mt');if(!e)return;const sc=scope(),q=S.q.toLowerCase();
const a=db.M.filter(m=>m.role=='member'&&(sc=='all'||m.church==sc)&&(m.name+m.phone).toLowerCase().includes(q)).slice(0,100);
e.innerHTML=`<div class=tw><table><tr><th>${t('name')}</th><th>${t('phone')}</th><th>${t('church')}</th><th>${t('total')}</th><th></th></tr>${a.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.phone)}</td><td>${esc(m.church)}</td><td>${rwf(db.P.filter(p=>p.mid==m.id).reduce((x,p)=>x+p.amt,0))}</td><td><button class="s d" onclick="delM('${m.id}')">${t('del')}</button></td></tr>`).join('')}</table></div>`}
function addM(sc){const n=$('#n1').value.trim(),p=$('#n2').value.trim();if(!n||p.length<9)return toast(t('bad'));if(db.M.some(x=>x.phone===p))return toast(t('exist'));
db.M.push({id:'m'+Date.now(),name:n,u:'',phone:p,church:sc=='all'?$('#n3').value:sc,role:'member'});save();render();toast(t('ok'))}
function printRep(){document.body.classList.add('rp');print();document.body.classList.remove('rp')}
function delM(id){if(!confirm(t('del')+'?'))return;db.M=db.M.filter(m=>m.id!=id);db.P=db.P.filter(p=>p.mid!=id);save();tbl()}
function cash(sc){const ms=db.M.filter(m=>m.role=='member'&&(sc=='all'||m.church==sc));
const rc=db.P.filter(p=>p.method=='Cash'&&p.by&&(sc=='all'||p.ch==sc)).sort((a,b)=>b.id.localeCompare(a.id)).slice(0,15);
return`<div class=card><h3>💵 ${t('cash')}</h3><div class=g2><div><label>${t('mbr')}</label><select id=c1>${ms.map(m=>`<option value=${m.id}>${esc(m.name)} · ${esc(m.phone)}</option>`).join('')}</select></div><div><label>${t('amount')}</label><input id=c2 type=number min=100></div><div><label>${t('date')}</label><input id=c3 type=date value="${fmt(new Date())}"></div></div><button onclick=doCash()>${t('save')}</button></div><div class=card>${ptable(rc,1)}</div>`}
function doCash(){const a=+$('#c2').value,mid=$('#c1').value;if(a<100||!mid)return toast(t('bad'));const m=db.M.find(x=>x.id==mid);
const p={id:'p'+Date.now(),mid,ch:m.church,amt:a,date:$('#c3').value,method:'Cash',by:S.u.name};db.P.push(p);save();render();toast(t('ok'));rcpt(p.id)}
S.u=curUser();
function render(){$('#app').innerHTML=head()+mgr();tbl()}
if(!S.u||S.u.role=='member')location.replace('index.html');else{S.ch=S.u.role=='admin'?'all':S.u.church;S.v=S.u.role=='admin'?'ana':'rep';render()}

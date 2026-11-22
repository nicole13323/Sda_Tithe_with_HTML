// Login / register page logic (choose role, sign in, register)
const RK={member:'rm',leader:'rl',admin:'ra'},RM={member:'member',leader:'treasurer',admin:'admin'},HINT={member:'0788100001',leader:'tres1 … tres8',admin:'admin'};
function auth(){const R=S.role,reg=R=='member'&&S.tab=='reg';
const top=!R?`<h3 style="text-align:center;margin-top:0">${t('who')}</h3>`+[['member','👤'],['leader','⛪'],['admin','🛡️']].map(x=>`<button class=role onclick="S.role='${x[0]}';S.tab='login';render()"><span>${x[1]}</span>${t(RK[x[0]])}</button>`).join(''):
`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><button class=s onclick="S.role=null;render()">← ${t('back')}</button><b>${t(RK[R])}</b></div>`+
(R=='member'?`<div class=tabs><button class="${!reg?'on':''}" onclick="S.tab='login';render()">${t('login')}</button><button class="${reg?'on':''}" onclick="S.tab='reg';render()">${t('register')}</button></div>`:'')+
(!reg?`<label>${t('phone')}</label><input id=a1><label>${t('password')}</label><input id=a2 type=password><button class=btn onclick=doLogin()>${t('login')}</button><small>Demo: ${HINT[R]} · ${t('password')}: 123</small>`:
`<label>${t('name')}</label><input id=r1><label>${t('phone')}</label><input id=r2 type=tel placeholder=07XXXXXXXX><label>${t('church')}</label><select id=r3>${chOpts()}</select><small>${t('pw')}</small><button class=btn onclick=doReg()>${t('register')}</button>`);
return`<div class=hero><img class=biglogo src="${LOGO}"><h1>${t('app')}</h1><p>Malachi 3:10</p></div><div class=wrap style="max-width:440px"><div class=card style="margin-top:-36px">${top}</div></div>`}
function doLogin(){const v=$('#a1').value.trim(),p=$('#a2').value;const m=db.M.find(x=>(x.phone&&x.phone===v)||(x.u&&x.u===v));
if(m&&p==='123'&&m.role==RM[S.role]){setSession(m.id);location.href=m.role=='member'?'member.html':'manager.html'}else toast(t('bad'))}
function doReg(){const n=$('#r1').value.trim(),p=$('#r2').value.trim();if(!n||p.length<9)return toast(t('bad'));
if(db.M.some(x=>x.phone===p))return toast(t('exist'));
const m={id:'m'+Date.now(),name:n,u:'',phone:p,church:$('#r3').value,role:'member'};db.M.push(m);save();setSession(m.id);location.href='member.html'}
if(curUser())location.replace(curUser().role=='member'?'member.html':'manager.html');
function render(){$('#app').innerHTML=head()+auth()}
render();

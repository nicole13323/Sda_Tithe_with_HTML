// Member dashboard: totals, pay tithe, history, receipts
function member(){const my=db.P.filter(p=>p.mid==S.u.id).sort((a,b)=>b.date.localeCompare(a.date)),y=new Date().getFullYear()+'';
const ty=my.filter(p=>p.date.startsWith(y)).reduce((a,p)=>a+p.amt,0);
return`<div class=hero style="padding:24px 16px 50px"><h2 style="margin:0">${esc(S.u.name)}</h2><p style="margin:4px">${esc(S.u.church)}</p></div><div class=wrap style="margin-top:-36px"><div class=stats><div class=stat><b>${rwf(ty)}</b><span>${t('yr')}</span></div><div class=stat><b>${rwf(my.reduce((a,p)=>a+p.amt,0))}</b><span>${t('total')}</span></div><div class=stat><b>${my.length}</b><span>${t('cnt')}</span></div></div>
<div class=card><h3>💚 ${t('pay')}</h3><div class=g2><div><label>${t('amount')}</label><input id=pa type=number min=100></div><div><label>${t('method')}</label><select id=pm><option>MTN MoMo</option><option>Airtel Money</option><option>Card</option></select></div></div><button onclick=doPay()>${t('pay')}</button></div>
<div class=card><h3>${t('hist')}</h3>${ptable(my,0)}</div></div>`}
function doPay(){const a=+$('#pa').value;if(a<100)return toast(t('bad'));
const p={id:'p'+Date.now(),mid:S.u.id,ch:S.u.church,amt:a,date:fmt(new Date()),method:$('#pm').value,by:''};db.P.push(p);save();render();toast(t('ok'));rcpt(p.id)}
S.u=curUser();
function render(){$('#app').innerHTML=head()+member()}
if(!S.u||S.u.role!='member')location.replace('index.html');else render();

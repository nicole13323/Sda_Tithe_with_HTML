// Shared data: churches, helpers, demo data, storage and login session
const LOGO='img/logo.png';const $=s=>document.querySelector(s);
const CH=['Kigali Central','Remera','Nyamirambo','Kicukiro','Musanze','Huye','Rubavu','Rwamagana'];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rwf=n=>Number(n).toLocaleString('en-US')+' RWF';
const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const ago=n=>{const d=new Date();d.setDate(d.getDate()-n);return fmt(d)};
function seed(){let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
const F=['Jean','Marie','Eric','Claudine','Patrick','Aline','Emmanuel','Grace','Olivier','Josiane','Innocent','Divine','Samuel','Esther','Claude','Immaculée'],N=['Mugisha','Uwase','Niyonzima','Mukamana','Habimana','Ingabire','Nsengimana','Uwimana','Ndayisaba','Mutesi','Hakizimana','Kamanzi','Iradukunda','Bizimana','Nkurunziza','Umutoni'];
const M=[],P=[];
CH.forEach((c,ci)=>{M.push({id:'t'+ci,name:'Treasurer '+c,u:'tres'+(ci+1),phone:'',church:c,role:'treasurer'});
for(let k=0;k<6;k++){const i=ci*6+k;M.push({id:'m'+i,name:F[(i*3+k)%16]+' '+N[(i*5+ci)%16],u:'',phone:'0788'+(100001+i),church:c,role:'member'})}});
M.push({id:'a',name:'Admin',u:'admin',phone:'',church:'',role:'admin'});
M.filter(m=>m.role=='member').forEach(m=>{for(let d=Math.floor(r()*10);d<430;d+=7+Math.floor(r()*28))P.push({id:'p'+P.length,mid:m.id,ch:m.church,amt:(2+Math.floor(r()*30))*1000,date:ago(d),method:['MTN MoMo','Airtel Money','Cash'][Math.floor(r()*3)],by:''})});
return{M,P}}
let db;try{db=JSON.parse(ls.g('sdaDB'))}catch(e){}if(!db)db=seed();
const save=()=>ls.s('sdaDB',JSON.stringify(db));
let S={role:null,u:null,tab:'login',v:'rep',per:'month',ch:'all',q:''};
const toast=m=>{const e=$('#toast');e.textContent=m;e.style.display='block';setTimeout(()=>e.style.display='none',2200)};
const chOpts=(sel)=>CH.map(c=>`<option ${c==sel?'selected':''}>${c}</option>`).join('');
// ---- login session (kept only while the tab is open)
const ss={g:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{v==null?sessionStorage.removeItem(k):sessionStorage.setItem(k,v)}catch(e){}}};
const setSession=id=>ss.s('sdaU',id),curUser=()=>db.M.find(m=>m.id===ss.g('sdaU'))||null;
const logout=()=>{ss.s('sdaU',null);location.href='index.html'};

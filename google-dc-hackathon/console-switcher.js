"use strict";
(function(){
if(window.__gdcConsoleSwitcher)return;window.__gdcConsoleSwitcher=1;
var items=[
  {mk:'ALL',name:'All consoles',sub:'console overview',url:'https://zann208.github.io/study/',c:'#34d399'},
  {mk:'NET',name:'Network Design',sub:'study console',url:'https://zann208.github.io/netdes/',c:'#22d3ee'},
  {mk:'WLN',name:'Wireless Networks',sub:'study console',url:'https://zann208.github.io/wnet/',c:'#38bdf8'},
  {mk:'ALG',name:'Algorithms for iSNE',sub:'study console',url:'https://zann208.github.io/algo/',c:'#f0b429'},
  {mk:'PRV',name:'Privacy Technologies',sub:'study console',url:'https://zann208.github.io/privacy/',c:'#a78bfa'},
  {mk:'OS',name:'Operating Systems',sub:'study console',url:'https://zann208.github.io/os/',c:'#34d399'},
  {mk:'GDC',name:'Google Data Center Hackathon',sub:'hardware preparation · 2026',url:'#',c:'#4285f4',here:true}
];
var style=document.createElement('style');style.textContent='\
#gdcSwitch{position:fixed;top:18px;right:18px;z-index:90;font-family:var(--sans)}\
#gdcSwitchBtn{display:flex;align-items:center;gap:9px;border:1px solid var(--line2);background:rgba(14,26,43,.96);color:var(--ink);border-radius:10px;padding:9px 11px;cursor:pointer;box-shadow:0 12px 32px rgba(0,0,0,.22)}\
#gdcSwitchBtn .mk{font:800 10px var(--mono);color:var(--blue);border:1px solid rgba(66,133,244,.55);border-radius:7px;padding:5px 6px}\
#gdcSwitchBtn b{font-size:12px}#gdcSwitchBtn i{font-style:normal;color:var(--faint);font-size:10px}\
#gdcSwitchPop{display:none;position:absolute;right:0;top:calc(100% + 8px);width:min(92vw,360px);background:#0d1a2b;border:1px solid var(--line2);border-radius:14px;padding:8px;box-shadow:0 22px 58px rgba(0,0,0,.45)}\
#gdcSwitchPop.open{display:block}.gdcsh{display:flex;justify-content:space-between;padding:7px 9px 9px;font:800 9px var(--mono);letter-spacing:1.2px;text-transform:uppercase;color:var(--faint)}\
.gdcsr{display:flex;align-items:center;gap:11px;padding:10px;border-radius:10px;color:var(--ink)}.gdcsr:hover{background:var(--panel2)}.gdcsr.here{background:rgba(66,133,244,.08);border:1px solid rgba(66,133,244,.35)}\
.gdcmk{width:36px;height:36px;border-radius:9px;display:grid;place-items:center;font:800 10px var(--mono);border:1px solid currentColor;flex:0 0 auto}.gdctx{flex:1;min-width:0}.gdctx b{display:block;font-size:13px}.gdctx span{display:block;font:10px var(--mono);color:var(--faint);margin-top:2px}.gdcgo{font:800 9px var(--mono);color:var(--faint);border:1px solid var(--line2);border-radius:6px;padding:4px 7px}.here .gdcgo{color:var(--cyan);border-color:var(--cyan)}\
@media(max-width:760px){#gdcSwitch{top:10px;right:10px}#gdcSwitchBtn b{display:none}}';document.head.appendChild(style);
var wrap=document.createElement('div');wrap.id='gdcSwitch';
wrap.innerHTML='<button id="gdcSwitchBtn" aria-expanded="false"><span class="mk">GDC</span><b>Switch console</b><i>▼</i></button><div id="gdcSwitchPop"><div class="gdcsh"><span>Study consoles</span><span>'+items.length+'</span></div>'+items.map(function(x){return '<a class="gdcsr'+(x.here?' here':'')+'" href="'+x.url+'"><span class="gdcmk" style="color:'+x.c+'">'+x.mk+'</span><span class="gdctx"><b>'+x.name+'</b><span>'+x.sub+'</span></span><span class="gdcgo">'+(x.here?'HERE':'OPEN ↗')+'</span></a>'}).join('')+'</div>';
document.body.appendChild(wrap);
var b=document.getElementById('gdcSwitchBtn'),p=document.getElementById('gdcSwitchPop');b.onclick=function(e){e.stopPropagation();var on=p.classList.toggle('open');b.setAttribute('aria-expanded',on?'true':'false')};document.addEventListener('click',function(e){if(!wrap.contains(e.target)){p.classList.remove('open');b.setAttribute('aria-expanded','false')}});
})();
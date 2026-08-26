(() => {
  const CONSOLES = [
    {id:'netdes', name:'Network Design & Troubleshooting', href:'https://zann208.github.io/netdes/'},
    {id:'wnet', name:'Wireless Network Engineering', href:'https://zann208.github.io/wnet/'},
    {id:'algo', name:'Algorithms & Data Structures', href:'https://zann208.github.io/algo/'},
    {id:'privacy', name:'Privacy & Information Security', href:'https://zann208.github.io/privacy/'},
    {id:'os', name:'Operating Systems & Scheduling', href:'https://zann208.github.io/os/'},
    {id:'gdc', name:'Google Data Center Hardware Hackathon', href:'https://zann208.github.io/study/google-dc-hackathon/'}
  ];
  const root = document.documentElement;
  const body = document.body;
  const isHome = body.dataset.consoleId === 'home';
  const currentId = body.dataset.consoleId || '';
  const currentName = body.dataset.consoleName || '';

  const storedTheme = localStorage.getItem('study-console-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') root.dataset.theme = storedTheme;

  /* Embedded lesson/reference pages live inside a parent console that already
     owns the global shell. Never inject a second Study Console header there. */
  if (window.self !== window.top) {
    body.classList.add('sc-embedded');
    return;
  }

  function themeLabel(){
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    return dark ? 'Use light theme' : 'Use dark theme';
  }
  function toggleTheme(){
    const currentDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = currentDark ? 'light' : 'dark';
    localStorage.setItem('study-console-theme', root.dataset.theme);
    updateThemeButton();
  }
  function updateThemeButton(){
    const btn=document.querySelector('[data-sc-theme]');
    if(!btn)return;
    const label=themeLabel();
    btn.setAttribute('aria-label',label);
    btn.setAttribute('title',label);
    btn.textContent='Theme';
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content',dark?'#171615':'#f7f5f2');
  }

  function createHeader(){
    const header=document.createElement('header');
    header.className='sc-global-header';
    const menuLinks = CONSOLES.map(c =>
      `<a href="${c.href}" ${c.id===currentId?'aria-current="page"':''}>${c.name}</a>`
    ).join('');
    header.innerHTML=`<div class="sc-global-inner">
      <a class="sc-home-link" href="https://zann208.github.io/study/">${isHome?'Study Console':'← Study Console'}</a>
      ${!isHome?`<span class="sc-console-title">${currentName}</span>`:''}
      <div class="sc-global-actions">
        <div class="sc-switch">
          <button class="sc-shell-button" type="button" data-sc-switch aria-expanded="false" aria-haspopup="true">Consoles</button>
          <div class="sc-switch-menu" data-sc-switch-menu hidden>${menuLinks}</div>
        </div>
        <button class="sc-shell-button sc-theme" type="button" data-sc-theme></button>
      </div>
    </div>`;
    body.prepend(header);
    const switchBtn=header.querySelector('[data-sc-switch]');
    const menu=header.querySelector('[data-sc-switch-menu]');
    const close=()=>{switchBtn.setAttribute('aria-expanded','false');menu.hidden=true};
    switchBtn.addEventListener('click',()=>{
      const open=switchBtn.getAttribute('aria-expanded')==='true';
      if(open) close(); else {switchBtn.setAttribute('aria-expanded','true');menu.hidden=false}
    });
    document.addEventListener('click',e=>{if(!e.target.closest('.sc-switch'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    header.querySelector('[data-sc-theme]').addEventListener('click',toggleTheme);
    updateThemeButton();
  }

  createHeader();

  document.querySelectorAll('[data-console-launch]').forEach(link=>{
    link.addEventListener('click',()=>{
      const item={
        id:link.dataset.consoleId||'',
        name:link.dataset.consoleName||link.textContent.trim(),
        href:link.href,
        at:Date.now()
      };
      localStorage.setItem('study-console-last',JSON.stringify(item));
    });
  });

  if(!isHome){
    localStorage.setItem('study-console-last',JSON.stringify({
      id:currentId,name:currentName,href:location.href.split('#')[0],at:Date.now()
    }));
  }

  const continueArea=document.querySelector('[data-continue-learning]');
  if(continueArea){
    let last=null;
    try{last=JSON.parse(localStorage.getItem('study-console-last')||'null')}catch{}
    if(last && last.id && last.id!=='home'){
      const name=(CONSOLES.find(c=>c.id===last.id)||{}).name||last.name;
      continueArea.hidden=false;
      continueArea.querySelector('[data-continue-name]').textContent=name;
      const link=continueArea.querySelector('[data-continue-link]');
      link.href=last.href;
    }
  }

  const menuBtn=document.querySelector('[data-sc-course-menu]');
  const sidebar=document.querySelector('.sc-sidebar');
  const overlay=document.querySelector('.sc-overlay');
  if(menuBtn && sidebar && overlay){
    const setOpen=open=>{
      sidebar.classList.toggle('open',open);
      overlay.classList.toggle('open',open);
      menuBtn.setAttribute('aria-expanded',String(open));
    };
    menuBtn.addEventListener('click',()=>setOpen(!sidebar.classList.contains('open')));
    overlay.addEventListener('click',()=>setOpen(false));
    sidebar.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=900)setOpen(false)}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
  }

  document.querySelectorAll('[data-copy-target]').forEach(btn=>{
    btn.addEventListener('click',async()=>{
      const el=document.querySelector(btn.dataset.copyTarget);
      if(!el)return;
      try{
        await navigator.clipboard.writeText(el.textContent);
        const old=btn.textContent;btn.textContent='Copied';setTimeout(()=>btn.textContent=old,1200);
      }catch{}
    });
  });
})();

/* Desktop Home composition; shared routes, profile and onboarding remain authoritative. */
(() => {
  const desktop = matchMedia('(min-width:1024px)');
  const baseView = view;
  let slideIndex = 0;
  let stopSlideshow = () => {};
  function compose() {
    if (!desktop.matches || activeRoute !== 'Inicio') return;
    const old = content.querySelector('.home-sections');
    if (!old) return;
    const profile = nxProfile();
    const name = nxEsc(profile.name || 'João Silva');
    const cm = nxEsc(profile.cm || '59500088');
    const qualified = new URLSearchParams(location.search).get('estado') === 'calificado';
    const campaignNodes = [...old.querySelectorAll('.campaign')];
    const checklist = old.querySelector('.next-onboarding');
    const shell = document.createElement('div');
    shell.className = 'native-home';
    shell.innerHTML = `
      <div class="dh-welcome"><div><p class="dh-eyebrow">TU NEGOCIO, DE UN VISTAZO</p><h1>Hola, ${name}</h1><div class="dh-identity"><span>CM: ${cm}</span><button class="dh-copy" data-dh-copy-cm="${cm}" aria-label="Copiar código CM"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="8" y="7" width="11" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"/></svg></button><button type="button" data-go="Mi situación" class="dh-head-status ${qualified?'is-qualified':''}">${qualified?'Calificado':'No Calificado'}</button></div></div></div>
      <div class="dh-grid">
        <article class="dh-campaigns"><div class="dh-panel-head"><div><h2>Campañas activas</h2><p>Oportunidades para seguir creciendo</p></div><button class="dh-link" data-go="Campañas">Ver campañas ↗</button></div><div class="dh-campaign-grid"></div></article>
        <aside class="dh-onboarding" aria-label="Primeros pasos"></aside>
        <article class="dh-news"><div class="dh-panel-head"><div><h2>Noticias</h2><p>Lo que está pasando en Nipponflex</p></div><button class="dh-link" data-go="Noticias">Todas las noticias ↗</button></div><div class="dh-news-grid"></div></article>

      </div>`;
    const images = ['assets/media/cruzeiro-original.png','assets/media/jantar-original.png','assets/media/embaixador.png','assets/media/equipo-retratos.png'];
    const slideshow = shell.querySelector('.dh-campaign-grid');
    slideshow.className = 'dh-slideshow';
    slideshow.setAttribute('role','region');
    slideshow.setAttribute('aria-label','Campañas destacadas');
    slideshow.setAttribute('aria-roledescription','carrusel');
    campaignNodes.forEach((node,i) => {
      const title = node.querySelector('h3').innerText.replace(/\n/g,' ');
      const slide = document.createElement('button');
      slide.className = 'dh-slide'; slide.type='button'; slide.dataset.go=node.dataset.go;
      slide.setAttribute('aria-label',title);
      slide.innerHTML = `<img src="${images[i]}" alt="" ${i?'loading="lazy"':''}><span class="dh-slide-shade"></span><span class="dh-slide-copy"><small>CAMPAÑA NIPPONFLEX</small><strong>${nxEsc(title)}</strong><span>Conoce la campaña <svg class="dh-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></span>`;
      slideshow.append(slide);
    });
    slideshow.insertAdjacentHTML('beforeend',`<div class="dh-slide-controls"><button type="button" data-slide-step="-1" aria-label="Campaña anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><div class="dh-slide-dots">${campaignNodes.map((_,i)=>`<button type="button" data-slide-index="${i}" aria-label="Mostrar campaña ${i+1}"></button>`).join('')}</div><span class="dh-slide-count" aria-live="off"></span><button type="button" data-slide-toggle aria-label="Pausar presentación"></button><button type="button" data-slide-step="1" aria-label="Campaña siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div>`);
    const cleanup=[];
    function bindSlideshow(container,initialIndex,remember) {
      const slides=[...container.querySelectorAll('.dh-slide')];
      let index=initialIndex,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,hovering=false,focused=false;
      const toggle=container.querySelector('[data-slide-toggle]');
      function showSlide(next) {
        index=(next+slides.length)%slides.length;remember(index);
        slides.forEach((slide,i)=>slide.hidden=i!==index);
        container.querySelectorAll('[data-slide-index]').forEach((dot,i)=>dot.setAttribute('aria-current',i===index?'true':'false'));
        container.querySelector('.dh-slide-count').textContent=`${index+1} / ${slides.length}`;
        toggle.setAttribute('aria-label',paused?'Reanudar presentación':'Pausar presentación');
        toggle.innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
      }
      container.addEventListener('click',e=>{
        const step=e.target.closest('[data-slide-step]'),dot=e.target.closest('[data-slide-index]');
        if(step)showSlide(index+Number(step.dataset.slideStep));
        if(dot)showSlide(Number(dot.dataset.slideIndex));
        if(e.target.closest('[data-slide-toggle]')){paused=!paused;showSlide(index);}
      });
      container.addEventListener('mouseenter',()=>hovering=true);
      container.addEventListener('mouseleave',()=>hovering=false);
      container.addEventListener('focusin',()=>focused=true);
      container.addEventListener('focusout',e=>focused=container.contains(e.relatedTarget));
      container.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();showSlide(index+(e.key==='ArrowRight'?1:-1));}});
      showSlide(index);
      const timer=setInterval(()=>{if(!paused&&!hovering&&!focused&&!document.hidden)showSlide(index+1);},6000);
      cleanup.push(()=>clearInterval(timer));
    }
    bindSlideshow(slideshow,slideIndex,value=>slideIndex=value);
    stopSlideshow=()=>cleanup.forEach(stop=>stop());
    if (checklist && checklist.querySelector('progress')?.value < 5) {
      checklist.querySelector('details').open = true;
      shell.querySelector('.dh-onboarding').append(checklist);
    } else {
      shell.querySelector('.dh-onboarding').innerHTML = '<article class="dh-panel dh-complete"><span class="dh-rank">Primeros pasos completados</span><h2>Todo listo para avanzar</h2><p>Encuentra recursos para desarrollar tu negocio.</p><button class="dh-outline" data-go="Capacitación">Explorar capacitación ↗</button></article>';
    }
    const arrow = '<svg class="dh-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
    shell.querySelectorAll('.dh-link,.dh-outline,.dh-campaign-caption,.dh-metric-foot,.dh-tool').forEach(el => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const targets = []; while(walker.nextNode()) if(/[↗→⧉]/.test(walker.currentNode.textContent)) targets.push(walker.currentNode);
      targets.forEach(node => { const part = document.createElement('span'); part.append(document.createTextNode(node.textContent.replace(/[↗→⧉]/g, ''))); part.insertAdjacentHTML('beforeend', arrow); node.replaceWith(part); });
    });
    const grid=shell.querySelector('.dh-grid');
    grid.replaceChildren(shell.querySelector('.dh-campaigns'),shell.querySelector('.dh-onboarding'),shell.querySelector('.dh-news'));
    old.replaceWith(shell);
  }
  view = function(...args) { stopSlideshow(); const result = baseView.apply(this,args); compose(); return result; };
  document.addEventListener('click', async e => {
    const copy = e.target.closest('[data-dh-copy-cm]');
    if (!copy) return;
    try { await navigator.clipboard.writeText(copy.dataset.dhCopyCm); exToast('Código CM copiado'); }
    catch { exToast('No se pudo copiar el código.'); }
  });
  desktop.addEventListener('change',()=>{if(activeRoute==='Inicio')view('Inicio');});
  compose();
})();

/* Desktop-only FAQ enhancements; shared mobile view remains unchanged. */
(()=>{
 const original=nextFAQ;
 nextFAQ=function(){
  const html=original();
  if(!matchMedia('(min-width:1024px)').matches)return html;
  return html.replace('<details class="next-faq-selector">','<details class="next-faq-selector" open>');
 };
 document.addEventListener('DOMContentLoaded',()=>{if(matchMedia('(min-width:1024px)').matches&&activeRoute==='Preguntas frecuentes')view(activeRoute)});
})();
/* Confirmación de contacto de atención, solo en escritorio. */
document.addEventListener('click',e=>{
 if(!matchMedia('(min-width:1024px)').matches)return;
 const a=e.target.closest('a[href*="wa.me/"]');
 if(!a||!/^contacto(?:\s|›|$)/i.test((a.getAttribute('aria-label')||a.textContent||'').trim()))return;
 e.preventDefault();e.stopImmediatePropagation();
 const d=document.createElement('dialog');d.className='dv-logout';d.innerHTML='<h2>¿Abrir WhatsApp?</h2><p>Serás dirigido al WhatsApp de atención de Nipponflex.</p><div><button class="dv-cancel" type="button">Cancelar</button><a class="dv-whats-open" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a></div>';
 d.querySelector('a').href=a.href;d.querySelector('button').onclick=()=>d.close();d.querySelector('a').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());document.body.append(d);d.showModal();
},true);

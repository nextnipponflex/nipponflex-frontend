/* Shared route handlers power desktop and mobile navigation. */
(()=>{
const links=[['Inicio','Inicio'],['Nuevo registro','Nuevo registro'],['Equipo','Mi equipo'],['Comisiones','Mis comisiones'],['Tienda online','Tienda Virtual'],['Capacitación','Capacitación'],['Puntos','Mis puntos'],['Ventas','Ventas'],['Noticias','Noticias'],['Mis solicitudes','Mis solicitudes'],['Descargas','Descargas'],['Preguntas frecuentes','Preguntas frecuentes'],['Contacto','Contacto'],['Más','Ver más']];
const glyph=r=>{
 const paths={
 'Nuevo registro':'<circle cx="9" cy="7" r="3.5"/><path d="M2 21v-2a7 7 0 0 1 14 0v2zM19 8v6m-3-3h6"/>',
 'Comisiones':'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 10c0 4 16 4 16 0M4 15c0 4 16 4 16 0"/>',
 'Mis solicitudes':'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v4H9zM9 12h6m-6 4h4"/>',
 'Mi reconocimiento':'<circle cx="12" cy="9" r="5"/><path d="m8 13-2 8 6-3 6 3-2-8"/>',
 'Preguntas frecuentes':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2.5M12 17h.01"/>',
 'Cerrar sesión':'<path d="M10 4H5v16h5m5-12 4 4-4 4m-6-4h10"/>',
 'Descargas':'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 'Contacto':'<path d="M4 13v-1a8 8 0 0 1 16 0v1M4 12H2v6h4v-6Zm16 0h2v6h-4v-6Zm0 6c0 3-4 3-8 3"/>',
 'Capacitación':'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c4 3 8 3 12 0v-6m4-2v7"/>',
 'Noticias':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8m-8 4h3m2 0h3m-8 3h8"/>'
 };
 return paths[r]?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[r]}</svg>`:icon(({Comisiones:'Ventas','Tienda online':'Tienda',Perfil:'Equipo'})[r]||r);
};
const sidebar=document.createElement('aside');sidebar.className='desktop-sidebar';sidebar.setAttribute('aria-label','Menú del portal');sidebar.innerHTML=`<button class="desktop-logo" data-go="Inicio" aria-label="Nipponflex, inicio"><img src="assets/media/logo-branco.png" alt="Nipponflex"></button><nav aria-label="Navegación del portal">${links.map(([r,l])=>r==='Contacto'?`<a class="desktop-contact" href="${rfWhatsURL()}" target="_blank" rel="noopener noreferrer" aria-label="Contacto por WhatsApp">${glyph(r)}<span>${l}</span></a>`:`<button data-go="${r}">${glyph(r)}<span>${l}</span></button>`).join('')}</nav><div class="desktop-sidebar-footer"><button data-go="Cerrar sesión">${glyph('Cerrar sesión')}<span>Cerrar sesión</span></button></div>`;document.body.append(sidebar);
const top=document.createElement('div');top.className='desktop-topbar';top.innerHTML=`<div class="desktop-breadcrumb"><button type="button" data-go="Inicio">Portal Nipponflex</button><strong id="desktopRouteTitle">Inicio</strong></div><div class="desktop-top-actions"><button data-go="Notificaciones" aria-label="Notificaciones"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 8a6 6 0 0 0-12 0c0 6-2 8-2 8h16s-2-2-2-8M10 21h4"/></svg></button><button data-go="Perfil"><img src="assets/media/avatar-demo.jpg" alt="">Mi perfil</button></div>`;document.body.append(top);
function sync(){const route=typeof activeRoute==='string'?activeRoute:'Inicio';document.body.dataset.desktopRoute=route;top.querySelector('strong').textContent=links.find(x=>x[0]===route)?.[1]||route;sidebar.querySelectorAll('[data-go]').forEach(b=>{const on=b.dataset.go===route||(route.startsWith('Mi equipo')&&b.dataset.go==='Equipo');b.classList.toggle('is-active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
const previous=view;view=function(...args){const result=previous.apply(this,args);sync();return result};sync();
})();
/* Desktop controls are outside the application container; route them explicitly. */
document.addEventListener('click',e=>{const b=e.target.closest('.desktop-sidebar button[data-go], .desktop-topbar button[data-go]');if(!b)return;e.stopImmediatePropagation();if(!document.querySelector('#story')?.classList.contains('hidden'))exCloseStory();view(b.dataset.go)},true);

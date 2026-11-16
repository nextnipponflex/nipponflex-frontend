/* Confirmar antes de abrir el contacto de atención por WhatsApp. */
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href*="wa.me/"]');
 if(!link || !/^contacto(?:\s|›|$)/i.test((link.getAttribute('aria-label')||link.textContent||'').trim()))return;
 e.preventDefault();e.stopImmediatePropagation();
 const dialog=document.createElement('dialog');dialog.className='mobile-contact-confirm';
 dialog.innerHTML='<h2>¿Abrir WhatsApp?</h2><p>Serás dirigido al WhatsApp de atención de Nipponflex.</p><div><button type="button" class="mobile-contact-cancel">Cancelar</button><a class="mobile-contact-open" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a></div>';
 dialog.querySelector('a').href=link.href;
 dialog.querySelector('.mobile-contact-cancel').addEventListener('click',()=>dialog.close());
 dialog.querySelector('a').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
},true);

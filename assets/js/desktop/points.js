/* Desktop point summaries: shared visual language, existing period data. */
(()=>{
 if(!matchMedia('(min-width:1024px)').matches)return;
 const blues=['#4f77e6','#4398f3','#0756b0','#6aacf5','#0b224b','#8fc1f8','#2965a8','#b2d5fb'];
 [ptColors,rfColors,m72Blues].forEach(p=>p.splice(0,p.length,...blues));
 const doughnutRamp=['#0b224b','#284d94','#4f77e6','#8295bc','#a1adc2','#bcc4d1','#d4d9e1','#eceef2'];
 m72Blues.splice(0,m72Blues.length,...doughnutRamp);
 const previousRing=rfRing;
 rfRing=function(rows,...args){
  const saved=[...m72Blues];
  const colors=rows.map((_,i)=>doughnutRamp[Math.round(i*(doughnutRamp.length-1)/Math.max(1,rows.length-1))]);
  m72Blues.splice(0,m72Blues.length,...colors);
  try{return previousRing(rows,...args)}finally{m72Blues.splice(0,m72Blues.length,...saved)}
 };

 const previous=rfPointCards;
 rfPointCards=function(){
  if(activeRoute!=='Puntos')return previous();
  const vals=[ptFormat(ptTotal('individual')),ptFormat(ptTotal()),'36','120',ptTotal('individual')>1?'Calificado':'No calificado',recognitionDegree()];
  const labels=['Individual','Equipo','Hijos directos','Distribuidores','Situación','Graduación'];
  const notes=['Puntos del período','Puntos del período','En tu primera línea','En tu red','Estado actual','Nivel actual'];
  return `<div class="rf-point-cards m72-static-cards dn-stat-cards">${labels.map((label,n)=>`<article class="m72-metric-card dn-stat-card"><span class="rf-metric-heading"><small class="dn-stat-title">${label}</small><span class="rf-card-icon dn-stat-icon">${n===0?m72PersonIcon:icon(n===1||n===3?'Equipo':n===2?'Registro':n===4?'Documento':'Capacitación')}</span></span><b class="dn-stat-value ${vals[n]==='No calificado'?'rf-status-unqualified':''}">${nxEsc(vals[n]).replace('No calificado','No Calificado')}</b><div class="dn-stat-footer"><span class="dn-stat-trend" aria-hidden="true">${n<2?'↗':'›'}</span><span>${notes[n]}</span></div></article>`).join('')}</div>`;
 };
 // Direct links must use the final renderer, not the shared startup fallback.
 if(activeRoute==='Puntos')view('Puntos');
})();

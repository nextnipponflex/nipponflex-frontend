/* One breakpoint shared by the two independently loaded interfaces. */
(() => {
  const breakpoint = matchMedia('(max-width:1023px)');
  const current = document.documentElement.dataset.platform;
  const page = document.documentElement.dataset.page;
  function routePlatform() {
    const target = breakpoint.matches ? 'mobile' : 'desktop';
    if (target === current) return;
    const path = (target === 'mobile' ? 'mobile/' : '') + (page === 'portal' ? 'portal.html' : 'index.html');
    const url = new URL(path, document.baseURI);
    url.search = location.search;
    url.hash = location.hash;
    location.replace(url.href);
  }
  routePlatform();
  breakpoint.addEventListener('change', routePlatform);
})();

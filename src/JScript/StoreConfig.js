(() => {
  let config = null;
  async function cargar() {
    if (config) return config;
    try {
      const res = await fetch(window.YeyaApi.url('/api/store-config'));
      if (!res.ok) return null;
      config = await res.json();
      return config;
    } catch (_) { return null; }
  }
  async function aplicar(root=document) {
    const c = await cargar(); if(!c)return;
    root.querySelectorAll('.title-shop-header strong, .title-shop-header-admin strong, [data-store-name]').forEach(el=>{el.textContent=c.nombreTienda||el.textContent;});
    root.querySelectorAll('[data-store-email]').forEach(el=>{el.textContent=c.correoContacto||el.textContent;});
    root.querySelectorAll('[data-store-welcome]').forEach(el=>{el.textContent=c.mensajeBienvenida||el.textContent;});
    root.querySelectorAll('[data-store-instagram]').forEach(el=>{if(c.instagram)el.href='https://instagram.com/'+String(c.instagram).replace(/^@/,'');});
    root.querySelectorAll('[data-store-tiktok]').forEach(el=>{if(c.tiktok)el.href='https://www.tiktok.com/@'+String(c.tiktok).replace(/^@/,'');});
  }
  window.YeyaStoreConfig={cargar,aplicar};
  document.addEventListener('DOMContentLoaded',()=>aplicar(document));
})();

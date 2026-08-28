async function leerError(res, fallback='Ocurrió un error.'){
  const raw=await res.text();
  if(!raw)return fallback;
  try{const j=JSON.parse(raw);return j.detail||j.message||j.error||fallback;}catch(_){return raw;}
}
async function adminApi(path,options={}){
  const headers=window.YeyaAuth.authHeaders(options.headers||{});
  const res=await fetch(window.YeyaApi.url(path),{...options,headers});
  if(!res.ok)throw new Error(await leerError(res));
  if(res.status===204)return null;
  const text=await res.text();
  return text?JSON.parse(text):null;
}

async function cargarAdmins(){
  const list=document.getElementById('admin-users-list'); if(!list)return;
  try{
    const users=(await adminApi('/api/admin/users')).filter(u=>String(u.rol).toLowerCase()==='admin');
    document.getElementById('admin-users-count').textContent=`${users.length} con acceso al panel`;
    const actual=window.YeyaAuth.getUsuario();
    list.innerHTML=users.map(u=>`<div class="card border-0 shadow-sm rounded-4 p-3"><div class="d-flex justify-content-between align-items-center gap-3 flex-wrap"><div><h6 class="fw-bold mb-1">${u.nombreCompleto}</h6><span class="text-muted small">${u.email} · ${u.telefono}</span></div><div class="d-flex align-items-center gap-2"><span class="badge rounded-pill" style="background:#fce7f3;color:#C66271">ADMIN</span>${Number(actual?.idUsuario)!==Number(u.idUsuario)?`<button class="btn btn-sm btn-outline-danger revoke-admin" data-id="${u.idUsuario}">Revocar</button>`:''}</div></div></div>`).join('');
    list.querySelectorAll('.revoke-admin').forEach(b=>b.onclick=async()=>{
      if(!confirm('¿Revocar acceso de administrador? El usuario seguirá existiendo como cliente.'))return;
      try{await adminApi(`/api/admin/users/${b.dataset.id}/role?role=user`,{method:'PATCH'});await cargarAdmins();}
      catch(e){alert(e.message||'No se pudo revocar el acceso.');}
    });
  }catch(e){list.innerHTML=`<p class="text-danger">${e.message||'No se pudieron cargar los administradores.'}</p>`;}
}

async function crearAdmin(){
  const nombre=prompt('Nombre del nuevo administrador:'); if(!nombre)return;
  const correo=prompt('Correo:'); if(!correo)return;
  const telefono=prompt('Teléfono de 10 dígitos:'); if(!telefono)return;
  const clave=prompt('Contraseña temporal (mínimo 7 caracteres):'); if(!clave)return;
  try{await adminApi('/api/admin/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre,correo,telefono,clave})});alert('Administrador creado.');await cargarAdmins();}
  catch(e){alert(e.message||'No se pudo crear el administrador.');}
}

async function cargarCategorias(){
  const list=document.getElementById('admin-categories-list'); if(!list)return;
  try{
    const [cats,rels]=await Promise.all([adminApi('/api/categorias'),adminApi('/api/producto-categoria')]);
    list.innerHTML=cats.map(c=>{const n=rels.filter(r=>Number(r.categoriasIdCategoria)===Number(c.idCategoria)).length;return `<div class="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row flex-wrap gap-3 justify-content-between align-items-center"><div><h6 class="fw-bold mb-0">${c.nombreCategoria}</h6><small class="text-muted">${c.slug}</small></div><div class="d-flex gap-3 align-items-center flex-wrap"><span class="text-muted small">${n} productos</span><button class="btn btn-sm btn-outline-secondary cat-edit" data-id="${c.idCategoria}" data-name="${c.nombreCategoria}" data-slug="${c.slug}">Editar</button><button class="btn btn-sm btn-outline-danger cat-delete" data-id="${c.idCategoria}">Eliminar</button></div></div>`}).join('');
    list.querySelectorAll('.cat-edit').forEach(b=>b.onclick=async()=>{
      const nombre=prompt('Nombre de categoría:',b.dataset.name);if(!nombre)return;
      try{await adminApi(`/api/categorias/${b.dataset.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombreCategoria:nombre,slug:''})});await cargarCategorias();}
      catch(e){alert(e.message||'No se pudo editar.');}
    });
    list.querySelectorAll('.cat-delete').forEach(b=>b.onclick=async()=>{
      if(!confirm('¿Eliminar categoría? Solo se eliminará si no está relacionada con productos o subcategorías.'))return;
      try{await adminApi(`/api/categorias/${b.dataset.id}`,{method:'DELETE'});alert('Categoría eliminada.');await cargarCategorias();}
      catch(e){alert(e.message||'No se pudo eliminar la categoría.');}
    });
  }catch(e){list.innerHTML=`<p class="text-danger">${e.message||'No se pudieron cargar las categorías.'}</p>`;}
}
async function crearCategoria(){
  const nombre=prompt('Nombre de la categoría:');if(!nombre)return;
  try{await adminApi('/api/categorias',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombreCategoria:nombre,slug:''})});await cargarCategorias();}
  catch(e){alert(e.message||'No se pudo crear la categoría.');}
}

async function cargarConfig(){
  const form=document.getElementById('store-config-form');if(!form)return;
  try{const c=await adminApi('/api/store-config');form.nombre.value=c.nombreTienda||'';form.correo.value=c.correoContacto||'';form.bienvenida.value=c.mensajeBienvenida||'';form.instagram.value=c.instagram||'';form.tiktok.value=c.tiktok||'';}catch(e){console.error(e);}
  form.onsubmit=async ev=>{ev.preventDefault();try{await adminApi('/api/store-config',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:1,nombreTienda:form.nombre.value,correoContacto:form.correo.value,mensajeBienvenida:form.bienvenida.value,instagram:form.instagram.value,tiktok:form.tiktok.value})});alert('Configuración guardada en MySQL.');}catch(e){alert(e.message||'No se pudo guardar.');}};
}

document.addEventListener('DOMContentLoaded',()=>{cargarAdmins();cargarCategorias();cargarConfig();document.getElementById('admin-add-user')?.addEventListener('click',crearAdmin);document.getElementById('admin-add-category')?.addEventListener('click',crearCategoria);});

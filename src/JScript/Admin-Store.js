function money(v){return new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(v||0));}
function fecha(v){if(!v)return ''; return new Date(v).toLocaleDateString('es-MX',{year:'numeric',month:'short',day:'2-digit'});}

async function apiJson(path, options={}){
  const res=await fetch(window.YeyaApi.url(path), {...options, headers:window.YeyaAuth.authHeaders(options.headers||{})});
  if(!res.ok) throw new Error(await res.text());
  return res.status===204?null:res.json();
}

async function cargarPedidos(){
  const tbody=document.querySelector('table tbody'); if(!tbody)return;
  try{
    const pedidos=await apiJson('/api/admin/orders');
    tbody.innerHTML=pedidos.map(p=>`<tr>
      <td class="ps-3 fw-bold" style="color:#C66271">#${p.numeroPedido}</td>
      <td><div class="fw-semibold">${p.cliente}</div><small class="text-muted">${p.email}</small></td>
      <td class="text-muted">${(p.productos||[]).join(', ')||'—'}</td>
      <td class="fw-bold">${money(p.total)}</td>
      <td><select class="form-select form-select-sm admin-order-status" data-id="${p.idPedidos}">
        ${['Pendiente','Procesando','Pagado','Enviado','Entregado','Cancelado'].map(e=>`<option ${e===p.estado?'selected':''}>${e}</option>`).join('')}
      </select></td>
      <td class="text-muted small">${fecha(p.fecha)}</td>
      <td><div class="small fw-semibold">${p.numeroRastreo || '—'}</div><small class="text-muted">${p.estadoEnvio || 'Sin envío'}</small></td>
      <td></td></tr>`).join('');
    document.querySelectorAll('.admin-order-status').forEach(s=>s.addEventListener('change',async e=>{
      const estado=e.target.value; const id=e.target.dataset.id;
      try{await apiJson(`/api/admin/orders/${id}/status?estado=${encodeURIComponent(estado)}`,{method:'PATCH'});}
      catch(err){alert('No se pudo actualizar el estado.'); console.error(err);}
    }));
  }catch(err){tbody.innerHTML='<tr><td colspan="8" class="text-danger p-4">No se pudieron cargar los pedidos.</td></tr>'; console.error(err);}
}

async function cargarClientes(){
  const container=document.getElementById('admin-client-list'); if(!container)return;
  try{
    const clientes=await apiJson('/api/admin/clients');
    const counter=document.getElementById('admin-client-count'); if(counter)counter.textContent=`${clientes.length} clientes registrados`;
    container.innerHTML=clientes.map(c=>`<div class="card border-0 shadow-sm rounded-4 p-3 d-flex flex-md-row justify-content-between align-items-md-center gap-3">
      <div><h6 class="fw-bold mb-1">${c.nombreCompleto}</h6><div class="text-muted small">${c.email} · ${c.telefono}</div></div>
      <div class="d-flex gap-4 text-center"><div><b>${c.pedidos}</b><small class="d-block text-muted">pedidos</small></div><div><b>${money(c.totalGastado)}</b><small class="d-block text-muted">gastado</small></div><div><b>${fecha(c.fechaRegistro)}</b><small class="d-block text-muted">registro</small></div></div>
    </div>`).join('');
    const input=document.getElementById('admin-client-search');
    input?.addEventListener('input',()=>{const q=input.value.toLowerCase(); [...container.children].forEach(card=>card.style.display=card.textContent.toLowerCase().includes(q)?'':'none');});
  }catch(err){container.innerHTML='<p class="text-danger">No se pudieron cargar los clientes.</p>'; console.error(err);}
}

document.addEventListener('DOMContentLoaded',()=>{cargarPedidos();cargarClientes();});

document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("contenedor-tabla-productos");
  const searchInput = document.getElementById("admin-search-products");
  const counterEl = document.getElementById("total-productos-contador");
  let productos = [];

  async function cargar() {
    if (!listContainer) return;
    try {
      const res = await fetch(window.YeyaApi.url("/api/products/catalog"));
      if (!res.ok) throw new Error(await res.text());
      productos = await res.json();
      render(productos);
    } catch (e) {
      console.error(e);
      listContainer.innerHTML = '<p class="text-danger p-3">No se pudieron cargar los productos.</p>';
    }
  }

  function render(lista) {
    if (!listContainer) return;
    if (counterEl) counterEl.textContent = `${lista.length} productos en tu tienda`;
    listContainer.innerHTML = lista.length ? lista.map(p => `
      <div class="card border-0 shadow-sm rounded-4 p-3 align-items-center flex-row justify-content-between gap-3 flex-wrap">
        <div class="d-flex align-items-center gap-3">
          <img src="${p.imagen || '../../assets/Images/An1.png'}" onerror="this.src='../../assets/Images/An1.png'" alt="${p.nombreProducto}" class="rounded-3 object-fit-cover" style="width:70px;height:70px">
          <div><h6 class="fw-bold mb-1">${p.nombreProducto}</h6><span class="small" style="color:#C66271">${(p.categorias||[]).join(', ') || 'Sin categoría'} · ${p.disponibilidad}</span><small class="d-block text-muted">Stock: ${p.stock}</small></div>
        </div>
        <div class="d-flex align-items-center gap-4"><b>$${Number(p.precio).toFixed(2)}</b><a href="9_A-Panel-Products-Add.html?id=${p.idProductos}" class="text-decoration-none fw-bold small" style="color:#C66271">Editar</a><button class="btn btn-link text-danger text-decoration-none fw-bold small p-0" data-delete-product="${p.idProductos}">Eliminar</button></div>
      </div>`).join('') : '<p class="text-muted p-3 text-center">No hay productos.</p>';

    listContainer.querySelectorAll('[data-delete-product]').forEach(btn => btn.onclick = async () => {
      const id = btn.dataset.deleteProduct;
      if (!confirm('¿Eliminar este producto? Si tiene historial de pedidos, el backend protegerá la integridad de la información.')) return;
      try {
        const res = await fetch(window.YeyaApi.url(`/api/products/${id}`), {method:'DELETE', headers:window.YeyaAuth.authHeaders()});
        if (res.status === 409) { alert('Este producto ya tiene historial de pedidos. En lugar de borrarlo, edítalo y deja stock 0.'); return; }
        if (!res.ok) throw new Error(await res.text());
        await cargar();
      } catch(e) { console.error(e); alert('No se pudo eliminar el producto.'); }
    });
  }

  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    render(productos.filter(p => `${p.nombreProducto} ${p.sku} ${(p.categorias||[]).join(' ')}`.toLowerCase().includes(q)));
  });
  cargar();
});

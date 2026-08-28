document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("home-featured-products");
  if (!container || !window.YeyaApi) return;

  try {
    const res = await fetch(window.YeyaApi.url("/api/products/catalog"));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const productos = await res.json();
    const destacados = productos
      .filter(p => Number(p.stock || 0) > 0 && String(p.disponibilidad || "").toLowerCase() !== "agotado")
      .slice(0, 4);

    if (!destacados.length) {
      container.innerHTML = '<div class="col-12 py-4"><p class="text-muted">Por el momento no hay piezas disponibles.</p></div>';
      return;
    }

    container.innerHTML = destacados.map(p => {
      const imagen = p.imagen || "../../assets/Images/An1.png";
      const categorias = (p.categorias || []).join(" · ") || "Joyería";
      return `<div class="col-12 col-sm-6 col-lg-3 mb-4">
        <div class="card text-center h-100 border-0 shadow-sm">
          <a href="5_Product-Detail.html?id=${p.idProductos}" class="text-decoration-none text-dark">
            <div class="card-img-container">
              <img src="${imagen}" onerror="this.src='../../assets/Images/An1.png'" class="card-img-top" alt="${p.nombreProducto}" style="height:260px;object-fit:cover;">
            </div>
          </a>
          <div class="card-body d-flex flex-column">
            <small class="text-muted mb-1">${categorias}</small>
            <a href="5_Product-Detail.html?id=${p.idProductos}" class="text-decoration-none text-dark"><h5 class="titulo-negro">${p.nombreProducto}</h5></a>
            <p class="parrafo-negro mb-3">$${Number(p.precio).toFixed(2)} MXN</p>
            <button class="btn btn-add-cart mt-auto" data-id="${p.idProductos}" data-name="${p.nombreProducto}" data-price="${Number(p.precio)}" data-image="${imagen}" data-stock="${Number(p.stock || 0)}">Agregar al carrito</button>
          </div>
        </div>
      </div>`;
    }).join("");
  } catch (error) {
    console.error("No se pudieron cargar las piezas destacadas:", error);
    container.innerHTML = '<div class="col-12 py-4"><p class="text-danger">No se pudieron cargar las piezas destacadas. Verifica que el backend esté encendido.</p></div>';
  }
});

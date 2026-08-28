document.addEventListener("DOMContentLoaded", async () => {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const loading = document.getElementById("product-detail-loading");
  const content = document.getElementById("product-detail-content");
  const errorBox = document.getElementById("product-detail-error");
  if (!id) {
    loading.classList.add("d-none"); errorBox.classList.remove("d-none");
    errorBox.textContent = "No se indicó un producto válido."; return;
  }
  try {
    const res = await fetch(window.YeyaApi.url(`/api/products/${id}/catalog`));
    if (!res.ok) throw new Error("Producto no encontrado");
    const p = await res.json();
    const img = p.imagen || "../../assets/Images/An1.png";
    const available = Number(p.stock || 0) > 0 && String(p.disponibilidad || "").toLowerCase() !== "agotado";
    document.getElementById("detail-image").src = img;
    document.getElementById("detail-image").onerror = e => e.currentTarget.src = "../../assets/Images/An1.png";
    document.getElementById("detail-name").textContent = p.nombreProducto;
    document.getElementById("detail-sku").textContent = `SKU: ${p.sku}`;
    document.getElementById("detail-description").textContent = p.descripcionProducto;
    document.getElementById("detail-price").textContent = `$${Number(p.precio).toFixed(2)} MXN`;
    document.getElementById("detail-category").textContent = (p.categorias || []).join(" · ") || "Joyería";
    const stock = document.getElementById("detail-stock");
    stock.textContent = available ? `Disponible · ${p.stock} pieza(s)` : "Agotado";
    stock.className = available ? "small text-success" : "small text-danger";
    const btn = document.getElementById("detail-add-cart");
    btn.disabled = !available;
    if (available) {
      btn.classList.add("btn-add-cart");
      btn.dataset.id = p.idProductos; btn.dataset.name = p.nombreProducto;
      btn.dataset.price = p.precio; btn.dataset.image = img; btn.dataset.stock = p.stock;
    }
    loading.classList.add("d-none"); content.classList.remove("d-none");
  } catch (err) {
    loading.classList.add("d-none"); errorBox.classList.remove("d-none");
    errorBox.textContent = "No se pudo cargar el producto. Verifica que el backend esté encendido.";
  }
});

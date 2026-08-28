// Pantalla de confirmación: muestra el pedido que YA fue guardado en el checkout.

document.addEventListener("DOMContentLoaded", () => {
  const infoPedido = JSON.parse(localStorage.getItem("ultimoPedidoInfo") || "null");
  const productosPedido = JSON.parse(localStorage.getItem("ultimoPedido") || "[]");
  const envioInfo = JSON.parse(localStorage.getItem("ultimoEnvioInfo") || "null");

  const elementoNumeroPedido = document.getElementById("numero-pedido");
  if (elementoNumeroPedido) {
    elementoNumeroPedido.textContent = infoPedido?.numeroPedido
      ? `#YEYA-${infoPedido.numeroPedido}`
      : "#YEYA-----";
  }

  cargarResumenCompra(productosPedido, infoPedido, envioInfo);
});

function cargarResumenCompra(productosPedido, infoPedido, envioInfo) {
  const contenedorProductos = document.getElementById("contenedor-productos-resumen");
  const elementoSubtotal = document.getElementById("subtotal-compra");
  const elementoEnvio = document.getElementById("envio-compra");
  const elementoTotal = document.getElementById("total-compra");

  if (!contenedorProductos) return;

  if (productosPedido.length === 0) {
    contenedorProductos.innerHTML =
      '<p class="text-muted small text-center my-3">No se encontraron detalles del pedido reciente.</p>';
    return;
  }

  contenedorProductos.innerHTML = "";
  let subtotalCalculado = 0;

  productosPedido.forEach((producto) => {
    const precio = Number(producto.price);
    const cantidad = Number(producto.quantity);
    const costoItemTotal = precio * cantidad;
    subtotalCalculado += costoItemTotal;

    const imagenSrc =
      producto.image || "../../assets/Images/An1.png";

    contenedorProductos.innerHTML += `
      <div class="item-producto-resumen d-flex align-items-center justify-content-between gap-3 border-bottom pb-2 mb-2">
        <div class="d-flex align-items-center gap-3">
          <img src="${imagenSrc}" alt="${producto.name}" class="imagen-miniatura-producto" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
          <div>
            <span class="nombre-item-producto d-block fw-bold" style="font-size: 0.9rem; color: #30343F;">${producto.name}</span>
            <span class="detalles-item-producto text-muted" style="font-size: 0.8rem;">Cant: ${cantidad} x $${precio.toFixed(2)} MXN</span>
          </div>
        </div>
        <span class="precio-item-producto fw-bold" style="color: #C66271; font-size: 0.9rem;">$${costoItemTotal.toFixed(2)} MXN</span>
      </div>`;
  });

  const costoEnvio = Number(envioInfo?.costoEnvio ?? 0);
  const totalBackend = Number(infoPedido?.total);
  const totalCalculado = Number.isFinite(totalBackend)
    ? totalBackend
    : subtotalCalculado + costoEnvio;

  if (elementoSubtotal) elementoSubtotal.textContent = `$${subtotalCalculado.toFixed(2)} MXN`;
  if (elementoEnvio) elementoEnvio.textContent = costoEnvio === 0 ? "Gratis" : `$${costoEnvio.toFixed(2)} MXN`;
  if (elementoTotal) elementoTotal.textContent = `$${totalCalculado.toFixed(2)} MXN`;
}

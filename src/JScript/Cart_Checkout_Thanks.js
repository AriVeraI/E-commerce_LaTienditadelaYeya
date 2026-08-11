// ---------------------------------------------------------------------------------------------------------------------------------------------- CART CHECKOUT --

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutCart();

  // Botón para procesar la compra final
  const btnFinalizar = document.getElementById("btn-finalizar-compra");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", (e) => {
      e.preventDefault();
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      // Validar formulario de envío básico
      const name = document.getElementById("shipping-name")?.value.trim();
      const address = document.getElementById("shipping-address")?.value.trim();
      if (!name || !address) {
        alert("Por favor completa los datos de envío.");
        return;
      }

      // Simular éxito de compra
      alert("¡Compra realizada con éxito! Gracias por tu pedido en La tiendita de la Yeya.");
      localStorage.setItem("ultimoPedido", localStorage.getItem("cart"));

      // Limpiar los campos de los formularios (envío y pago)
      const shippingForm = document.getElementById("shipping-form");
      const paymentForm = document.getElementById("payment-form");

      if (shippingForm) shippingForm.reset();
      if (paymentForm) paymentForm.reset();

      // Limpiar carrito en localStorage
      localStorage.removeItem("cart");

      // Redirigir a la página de confirmación
      window.location.href = "6_Cart-Thanks.html"; 
    });
  }
});

function renderCheckoutCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("checkout-cart-items");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-muted text-center my-3">No hay productos en tu carrito.</p>`;
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    // Obtener la ruta de la imagen (soporta tanto item.image como item.img)
    const imgSrc = item.image || item.img || '../../assets/Images/placeholder.png';

    html += `
      <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center gap-3">
          <!-- Imagen del producto -->
          <img src="${imgSrc}" alt="${item.name || item.title}" class="rounded" style="width: 64px; height: 64px; object-fit: cover;">
          <div>
            <h6 class="mb-0 fw-bold">${item.name || item.title}</h6>
            <small class="text-muted">Precio unitario: $${item.price}</small>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', -1)">-</button>
          <span class="fw-bold px-1">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>

        <span class="fw-bold text-danger">$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  container.innerHTML = html;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Función global para sumar o restar cantidades desde el checkout
window.updateQuantity = function (id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => String(item.id) === String(id));

  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => String(item.id) !== String(id));
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCheckoutCart();
};

// -------------------------------------------------------------------------------------------------------------------------------------------------- CART THANKS --
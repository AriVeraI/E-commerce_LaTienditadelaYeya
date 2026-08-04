
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
      const name = document.getElementById("shipping-name").value;
      const address = document.getElementById("shipping-address").value;
      if (!name || !address) {
        alert("Por favor completa los datos de envío.");
        return;
      }

      // Simular éxito de compra y limpiar carrito
      alert("¡Compra realizada con éxito! Gracias por tu pedido en La tiendita de la Yeya.");
      localStorage.setItem("ultimoPedido", localStorage.getItem("cart"));
      localStorage.removeItem("cart");
      
      // Redirigir a la página de confirmación o inicio
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

    html += `
      <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <div>
          <h6 class="mb-0 fw-bold">${item.name}</h6>
          <small class="text-muted">Precio unitario: $${item.price}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
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
  const product = cart.find((item) => item.id === id);

  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCheckoutCart();
};

// -------------------------------------------------------------------------------------------------------------------------------------------------- CART THANKS --

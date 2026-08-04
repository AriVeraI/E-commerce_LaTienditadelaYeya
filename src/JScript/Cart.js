// Cart.js - Lógica global del carrito de compras para "La tiendita de la Yeya"

// 1. Cargar el carrito desde la memoria del navegador (localStorage) o iniciar vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-drawer-container");

  // Cargamos el HTML del Offcanvas dinámicamente
  if (cartContainer) {
    fetch("../Pages/6_Cart.html")
      .then((response) => response.text())
      .then((data) => {
        cartContainer.innerHTML = data;

        // IMPORTANTE: Una vez que el HTML del carrito está inyectado, pintamos su contenido
        updateCartUI();
        initCheckoutButton();
      })
      .catch((error) => console.error("Error al cargar el carrito lateral:", error));
  } else {
    updateCartUI();
    initCheckoutButton();
  }

  // Capturar clics en cualquier botón de "Agregar al carrito"
  const addButtons = document.querySelectorAll(".btn-add-cart");

  addButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Corregido: Coincide exactamente con data-title y data-img puestos en el HTML
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-title");
      const price = parseFloat(button.getAttribute("data-price"));
      const image = button.getAttribute("data-img");

      addProductToCart(id, name, price, image);
    });
  });
});

// Función para inicializar el botón de checkout
function initCheckoutButton() {
  const checkoutBtn = document.querySelector(".cart-footer .btn-dark, #checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      if (cart.length === 0) {
        e.preventDefault();
        alert("Tu carrito está vacío. Agrega productos antes de pagar.");
        return;
      }
      window.location.href = "6_Cart-Checkout.html";
    });
  }
}

// Función para agregar un producto o aumentar su cantidad si ya fue añadido
function addProductToCart(id, name, price, image) {
  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  saveAndRefresh();

  // Abrir automáticamente el Offcanvas de Bootstrap
  const cartDrawer = document.getElementById("cartOffcanvas") || document.getElementById("cartDrawer");
  if (cartDrawer) {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartDrawer);
    bsOffcanvas.show();
  }
}

// Guardar cambios en localStorage y refrescar la vista del carrito
function saveAndRefresh() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Función para pintar los productos dentro del panel lateral flotante
function updateCartUI() {
  const container = document.querySelector(".cart-items-container, #lista-carrito");
  const subtotalEl = document.querySelector(".cart-footer .fs-5, .cart-subtotal, #subtotal-carrito");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-muted my-4">Tu carrito está vacío</p>`;
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
      <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded">
          <div>
            <h6 class="mb-0 fw-bold small">${item.name}</h6>
            <small class="text-muted">Cant: ${item.quantity} x $${item.price}</small>
          </div>
        </div>
        <div class="text-end">
          <span class="fw-bold d-block">$${itemTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
          <button class="btn btn-sm text-danger p-0 border-0 bg-transparent" onclick="removeItem('${item.id}')">
            <small>Eliminar</small>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  }
}

// Función global para eliminar un producto específico del carrito
window.removeItem = function (id) {
  cart = cart.filter((item) => item.id !== id);
  saveAndRefresh();
};
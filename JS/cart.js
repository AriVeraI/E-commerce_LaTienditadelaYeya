// cart.js - Lógica global del carrito de compras para "La tiendita de la Yeya"

// 1. Cargar el carrito desde la memoria del navegador (localStorage) o iniciar vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  // Actualizar la interfaz visual del carrito apenas carga cualquier página
  updateCartUI();

  // Capturar clics en cualquier botón de "Agregar al carrito" en el catálogo o index
  const addButtons = document.querySelectorAll(".btn-add-cart");

  addButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Extraer la información del producto usando los atributos data-* del botón
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));
      const image = button.getAttribute("data-image");

      addProductToCart(id, name, price, image);
    });
  });

  // Conectar el botón de "Proceder al Pago" dentro del Offcanvas para que lleve al checkout.html
  const checkoutBtn = document.querySelector(
    ".cart-footer .btn-dark, #checkout-btn",
  );
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      // Si el carrito está vacío, evitamos que vaya al pago
      if (cart.length === 0) {
        e.preventDefault();
        alert("Tu carrito está vacío. Agrega productos antes de pagar.");
        return;
      }
      // Si tiene productos, redirige a tu página de pago que ya creaste
      window.location.href = "checkout.html";
    });
  }
});

// Función para agregar un producto o aumentar su cantidad si ya fue añadido
function addProductToCart(id, name, price, image) {
  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  saveAndRefresh();

  // Abrir automáticamente el panel lateral (Offcanvas) para darle feedback visual al usuario
  const cartDrawer = document.getElementById("cartDrawer");
  if (cartDrawer) {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartDrawer);
    bsOffcanvas.show();
  }
}

// Guardar cambios en el navegador y refrescar la vista del carrito
function saveAndRefresh() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Función para pintar los productos dentro del panel lateral flotante
function updateCartUI() {
  const container = document.querySelector(".cart-items-container");
  const subtotalEl = document.querySelector(
    ".cart-footer .fs-5, .cart-subtotal",
  ); // Elemento del precio total

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
                        <small class="text-muted">Cant: ${item.quantity}</small>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-bold text-danger d-block">$${itemTotal}</span>
                    <button class="btn btn-sm text-danger p-0 border-0 bg-transparent" onclick="removeItem('${item.id}')"><small>Eliminar</small></button>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Función global para eliminar un producto específico del carrito
window.removeItem = function (id) {
  cart = cart.filter((item) => item.id !== id);
  saveAndRefresh();
};

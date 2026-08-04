// ---------------------------------------------------------------------------------------------------------------------------------------Cart

// Función para cargar componentes externos como el Offcanvas del carrito
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-drawer-container");
  
  if (cartContainer) {
    // Ajusta la ruta relativa según el nivel en el que esté tu página HTML actual respecto a cart-drawer.html
    fetch("../Pages/6_Cart.html")
      .then((response) => response.text())
      .then((data) => {
        cartContainer.innerHTML = data;
      })
      .catch((error) => console.error("Error al cargar el carrito lateral:", error));
  }
});

// cart.js - Lógica global del carrito de compras para "La tiendita de la Yeya"

// 1. Cargar el carrito desde la memoria del navegador (localStorage) o iniciar vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  // Actualizar la interfaz visual del carrito apenas carga cualquier página
  updateCartUI();

  // DELEGACIÓN DE EVENTOS: Capturar clics en cualquier botón de "Agregar al carrito"
  // Esto asegura que funcione incluso para productos generados dinámicamente
  document.addEventListener("click", (e) => {
    const button = e.target.closest(".btn-add-cart");
    
    if (button) {
      e.preventDefault();

      // Extraer la información del producto usando los atributos data-* del botón
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));
      const image = button.getAttribute("data-image");

      addProductToCart(id, name, price, image);
    }
  });

  // Conectar el botón de "Proceder al Pago" dentro del Offcanvas para que lleve al checkout.html
  // Usamos delegación también porque el offcanvas se carga por fetch
  document.addEventListener("click", (e) => {
    const checkoutBtn = e.target.closest(".cart-footer .btn-dark, #checkout-btn");
    
    if (checkoutBtn) {
      if (cart.length === 0) {
        e.preventDefault();
        alert("Tu carrito está vacío. Agrega productos antes de pagar.");
        return;
      }
      window.location.href = "6_Cart-Checkout.html";
    }
  });
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
  const subtotalEl = document.querySelector(".cart-footer .fs-5, .cart-subtotal"); 

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

    // Se agregan botones para modificar la cantidad (+ y -)
    html += `
            <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded">
                    <div>
                        <h6 class="mb-0 fw-bold small">${item.name}</h6>
                        
                        <!-- Controles de cantidad -->
                        <div class="d-flex align-items-center mt-2">
                            <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="changeQuantity('${item.id}', -1)">-</button>
                            <span class="mx-2 small fw-bold">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="changeQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-bold text-danger d-block">$${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-sm text-danger p-0 border-0 bg-transparent mt-2" onclick="removeItem('${item.id}')"><small>Eliminar</small></button>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Función global para modificar la cantidad (+1 o -1)
window.changeQuantity = function (id, delta) {
  const product = cart.find((item) => item.id === id);
  if (product) {
    product.quantity += delta;
    
    // Si la cantidad llega a 0, se elimina del carrito
    if (product.quantity <= 0) {
      removeItem(id);
    } else {
      saveAndRefresh();
    }
  }
};

// Función global para eliminar un producto específico del carrito
window.removeItem = function (id) {
  cart = cart.filter((item) => item.id !== id);
  saveAndRefresh();
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------Cart
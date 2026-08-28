// Carrito global de La Tiendita de la Yeya.
// Los visitantes pueden armar su carrito, pero el checkout requiere una sesión válida.

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let cartDrawerReady = Promise.resolve();

function cargarCartDrawer() {
  const cartContainer = document.getElementById("cart-drawer-container");
  if (!cartContainer) return Promise.resolve();
  if (document.getElementById("cartDrawer")) return Promise.resolve();

  return fetch("../Pages/6_Cart.html")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((data) => {
      cartContainer.innerHTML = data;
      updateCartUI();
    })
    .catch((error) => console.error("Error al cargar el carrito lateral:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  cartDrawerReady = cargarCartDrawer();
  updateCartUI();
});

// Delegación de eventos: funciona también para productos inyectados dinámicamente
// en Home, Catálogo y Detalle.
document.addEventListener("click", (e) => {
  const button = e.target.closest(".btn-add-cart");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  const id = String(button.getAttribute("data-id") || "");
  const name = button.getAttribute("data-name") || "Producto";
  const price = Number(button.getAttribute("data-price"));
  const image = button.getAttribute("data-image") || "../../assets/Images/An1.png";
  const stock = Number(button.getAttribute("data-stock") || 0);

  if (!id || !Number.isFinite(price)) {
    alert("No se pudo identificar correctamente este producto.");
    return;
  }

  addProductToCart(id, name, price, image, stock);
});

// Proceder al pago: carrito sí para visitantes; comprar, únicamente con sesión válida.
document.addEventListener("click", async (e) => {
  const checkoutBtn = e.target.closest(".cart-footer .btn-dark, #checkout-btn");
  if (!checkoutBtn) return;

  e.preventDefault();

  if (cart.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de pagar.");
    return;
  }

  let sesionValida = false;
  try {
    sesionValida = Boolean(window.YeyaAuth && await window.YeyaAuth.validarSesion());
  } catch (error) {
    console.warn("No fue posible validar la sesión antes del checkout:", error);
  }

  if (!sesionValida) {
    sessionStorage.setItem("yeyaPostLoginRedirect", "6_Cart-Checkout.html");
    alert("Para continuar con la compra debes iniciar sesión.");
    window.location.href = "8_Client-Login.html";
    return;
  }

  window.location.href = "6_Cart-Checkout.html";
});

function addProductToCart(id, name, price, image, stock) {
  const normalizedId = String(id);
  const existingProduct = cart.find((item) => String(item.id) === normalizedId);
  const maxStock = Number(stock || existingProduct?.stock || 0);

  if (maxStock <= 0) {
    alert("Este producto está agotado.");
    return;
  }

  if (existingProduct) {
    if (Number(existingProduct.quantity) >= maxStock) {
      alert(`Solo hay ${maxStock} pieza(s) disponibles de ${name}.`);
      return;
    }
    existingProduct.quantity += 1;
    existingProduct.stock = maxStock;
  } else {
    cart.push({ id: normalizedId, name, price, image, stock: maxStock, quantity: 1 });
  }

  saveAndRefresh();

  // El componente se carga por fetch; esperamos a que exista antes de abrirlo.
  Promise.resolve(cartDrawerReady).then(() => {
    updateCartUI();
    const cartDrawer = document.getElementById("cartDrawer");
    if (cartDrawer && window.bootstrap?.Offcanvas) {
      bootstrap.Offcanvas.getOrCreateInstance(cartDrawer).show();
    }
  });
}

function saveAndRefresh() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

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
    const itemTotal = Number(item.price) * Number(item.quantity);
    subtotal += itemTotal;

    html += `
      <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover" class="rounded">
          <div>
            <h6 class="mb-0 fw-bold small">${item.name}</h6>
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
      </div>`;
  });

  container.innerHTML = html;
  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  }
}

window.changeQuantity = function (id, delta) {
  const product = cart.find((item) => String(item.id) === String(id));
  if (!product) return;

  if (delta > 0 && Number(product.stock || 0) <= Number(product.quantity)) {
    alert(`No puedes agregar más de ${product.stock} pieza(s) disponibles.`);
    return;
  }

  product.quantity += delta;
  if (product.quantity <= 0) {
    window.removeItem(id);
  } else {
    saveAndRefresh();
  }
};

window.removeItem = function (id) {
  cart = cart.filter((item) => String(item.id) !== String(id));
  saveAndRefresh();
};

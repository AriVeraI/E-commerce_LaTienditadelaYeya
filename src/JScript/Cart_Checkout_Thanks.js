// Checkout integrado con Spring Boot.
// Registra en una sola operación: pedido, detalle, dirección, pago simulado y envío.

const API_ORDERS_URL = window.YeyaApi.url("/api/orders");
const METODOS_PAGO_PERMITIDOS = [
  "Tarjeta simulada",
  "PayPal simulado",
  "Mercado Pago simulado",
];

document.addEventListener("DOMContentLoaded", async () => {
  // UX + seguridad en profundidad: la API ya exige token, y además el frontend
  // no permite ni usar el checkout si no existe una sesión vigente.
  let sesionValida = false;
  try {
    sesionValida = Boolean(window.YeyaAuth && await window.YeyaAuth.validarSesion());
  } catch (error) {
    console.warn("No fue posible validar la sesión de checkout:", error);
  }

  if (!sesionValida) {
    sessionStorage.setItem("yeyaPostLoginRedirect", "6_Cart-Checkout.html");
    alert("Para realizar una compra debes iniciar sesión.");
    window.location.replace("8_Client-Login.html");
    return;
  }

  renderCheckoutCart();
  precargarDatosUsuario();
  configurarOpcionesPago();

  const btnFinalizar = document.getElementById("btn-finalizar-compra");
  if (!btnFinalizar) return;

  btnFinalizar.addEventListener("click", async (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const usuario = JSON.parse(sessionStorage.getItem("usuarioActual") || "null");
    if (!usuario?.idUsuario) {
      alert("Para finalizar tu compra primero debes iniciar sesión.");
      window.location.href = "8_Client-Login.html";
      return;
    }

    const shippingForm = document.getElementById("shipping-form");
    if (!shippingForm || !shippingForm.checkValidity()) {
      shippingForm?.reportValidity();
      return;
    }

    const direccion = leerDireccionCheckout();
    const metodoPago = obtenerMetodoPagoSeleccionado();
    if (!metodoPago) {
      alert("Selecciona un método de pago.");
      return;
    }

    const errorValidacion = validarDireccion(direccion);
    if (errorValidacion) {
      alert(errorValidacion);
      return;
    }

    btnFinalizar.disabled = true;
    btnFinalizar.textContent = "Procesando...";

    try {
      const pedido = await enviarOrdenAlBackend(usuario.idUsuario, cart, direccion, metodoPago);

      // Se conserva únicamente información no sensible para la pantalla de gracias.
      localStorage.setItem("ultimoPedido", JSON.stringify(cart));
      localStorage.setItem("ultimoPedidoInfo", JSON.stringify(pedido));
      localStorage.setItem(
        "ultimoEnvioInfo",
        JSON.stringify({ costoEnvio: 0, metodoPago })
      );
      localStorage.removeItem("cart");

      shippingForm.reset();

      alert("¡Compra realizada con éxito! Gracias por tu pedido en La Tiendita de la Yeya.");
      window.location.href = "6_Cart-Thanks.html";
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      alert(error.message || "No se pudo procesar la compra.");
      btnFinalizar.disabled = false;
      btnFinalizar.textContent = "Finalizar Compra";
    }
  });
});


function obtenerMetodoPagoSeleccionado() {
  const seleccionado = document.querySelector('input[name="metodoPago"]:checked');
  if (!seleccionado || !METODOS_PAGO_PERMITIDOS.includes(seleccionado.value)) {
    return null;
  }
  return seleccionado.value;
}

function configurarOpcionesPago() {
  const opciones = document.querySelectorAll("[data-payment-option]");
  const radios = document.querySelectorAll('input[name="metodoPago"]');

  const actualizarSeleccion = () => {
    opciones.forEach((opcion) => {
      const radio = opcion.querySelector('input[name="metodoPago"]');
      opcion.classList.toggle("selected", Boolean(radio?.checked));
    });
  };

  radios.forEach((radio) => radio.addEventListener("change", actualizarSeleccion));
  actualizarSeleccion();
}

function leerDireccionCheckout() {
  return {
    nombreCompleto: document.getElementById("shipping-name")?.value.trim() || "",
    calle: document.getElementById("shipping-street")?.value.trim() || "",
    numero: document.getElementById("shipping-number")?.value.trim() || "",
    colonia: document.getElementById("shipping-colony")?.value.trim() || "",
    ciudad: document.getElementById("shipping-city")?.value.trim() || "",
    estado: document.getElementById("shipping-state")?.value.trim() || "",
    codigoPostal: document.getElementById("shipping-zip")?.value.trim() || "",
    telefono: document.getElementById("shipping-phone")?.value.trim() || "",
  };
}

function validarDireccion(direccion) {
  if (!/^(?!0+$)[A-Za-z0-9-]{1,10}$/.test(direccion.numero)) {
    return "Ingresa un número exterior válido distinto de 0.";
  }
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .-]{2,25}$/.test(direccion.ciudad)) {
    return "Ingresa una ciudad válida (sin números).";
  }
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .-]{2,45}$/.test(direccion.estado)) {
    return "Ingresa un estado válido (sin números).";
  }
  if (!/^\d{5}$/.test(direccion.codigoPostal)) {
    return "El código postal debe contener exactamente 5 dígitos.";
  }

  const telefonoLimpio = direccion.telefono.replace(/\D/g, "");
  if (telefonoLimpio.length < 10 || telefonoLimpio.length > 15) {
    return "Ingresa un número de teléfono válido de 10 a 15 dígitos.";
  }

  return null;
}

function precargarDatosUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioActual") || "null");
  if (!usuario) return;

  const nameInput = document.getElementById("shipping-name");
  const phoneInput = document.getElementById("shipping-phone");

  if (nameInput && !nameInput.value && usuario.nombreCompleto) {
    nameInput.value = usuario.nombreCompleto;
  }
  if (phoneInput && !phoneInput.value && usuario.telefono) {
    phoneInput.value = usuario.telefono;
  }
}

async function enviarOrdenAlBackend(idUsuario, productosCarrito, direccion, metodoPago) {
  const nuevaOrden = {
    idUsuario,
    items: productosCarrito.map((item) => ({
      idProducto: Number(item.id),
      cantidad: Number(item.quantity),
    })),
    direccion,
    pago: {
      metodoPago,
    },
  };

  const response = await fetch(API_ORDERS_URL, {
    method: "POST",
    headers: window.YeyaAuth?.authHeaders({ "Content-Type": "application/json" }) || { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaOrden),
  });

  if (!response.ok) {
    let mensaje = "Hubo un problema al procesar tu pedido.";
    try {
      const error = await response.json();
      mensaje = error.detail || error.message || error.error || mensaje;
    } catch (_) {
      // La respuesta puede no contener JSON.
    }
    throw new Error(mensaje);
  }

  return response.json();
}

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

    const imgSrc = item.image || item.img || "../../assets/Images/placeholder.png";

    html += `
      <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center gap-3">
          <img src="${imgSrc}" alt="${item.name || item.title}" class="rounded" style="width: 64px; height: 64px; object-fit: cover;">
          <div>
            <h6 class="mb-0 fw-bold">${item.name || item.title}</h6>
            <small class="text-muted">Precio unitario: $${Number(item.price).toFixed(2)}</small>
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

window.updateQuantity = function (id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => String(item.id) === String(id));

  if (product) {
    if (change > 0 && Number(product.stock || 999999) <= Number(product.quantity)) {
      alert("No puedes agregar más de " + product.stock + " pieza(s) disponibles.");
      return;
    }
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => String(item.id) !== String(id));
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCheckoutCart();
};

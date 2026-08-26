// ---------------------------------------------------------------------------------------------------------------------------------------Cart
// Lógica para cargar componentes externos como el Offcanvas del carrito
document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-drawer-container");

    if (cartContainer) {
        fetch("../Pages/6_Cart.html")
            .then((response) => response.text())
            .then((data) => {
                cartContainer.innerHTML = data;
                // Una vez cargado el HTML del offcanvas, consultamos el backend
                cargarCarritoBackend();
            })
            .catch((error) => console.error("Error al cargar el carrito lateral:", error));
    } else {
        // Si el offcanvas ya está quemado en el HTML principal
        cargarCarritoBackend();
    }
});

// Variable global para almacenar el carrito del backend
let carritoBackend = { idCarrito: null, items: [] };
const idUsuarioGlobal = 15; // Usuario definido en duro temporalmente

// Función para obtener los datos del carrito desde el backend (Usuario ID: 15)
function cargarCarritoBackend() {
    const url = `http://localhost:8080/api/carritos/detalle/${idUsuarioGlobal}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos del carrito del backend");
            }
            return response.json();
        })
        .then(data => {
            carritoBackend = data;
            updateCartUI();
        })
        .catch(error => {
            console.error("Hubo un problema con la petición al backend:", error);
            const container = document.querySelector(".cart-items-container");
            if (container) {
                container.innerHTML = `<p class="text-center text-danger my-4">Error al cargar el carrito</p>`;
            }
        });
}

// Conectar el botón de "Proceder al Pago" dentro del Offcanvas
document.addEventListener("click", (e) => {
    const checkoutBtn = e.target.closest(".cart-footer .btn-dark, #checkout-btn");

    if (checkoutBtn) {
        if (!carritoBackend.items || carritoBackend.items.length === 0) {
            e.preventDefault();
            alert("Tu carrito está vacío. Agrega productos antes de pagar.");
            return;
        }
        window.location.href = "6_Cart-Checkout.html";
    }
});

// Función para pintar los productos devueltos por el backend dentro del panel lateral
function updateCartUI() {
    const container = document.querySelector(".cart-items-container");
    const subtotalEl = document.querySelector(".cart-footer .fs-5, .cart-subtotal");

    if (!container) return;

    if (!carritoBackend.items || carritoBackend.items.length === 0) {
        container.innerHTML = `<p class="text-center text-muted my-4">Tu carrito está vacío</p>`;
        if (subtotalEl) subtotalEl.textContent = "$0.00";
        return;
    }

    let html = "";
    let subtotal = 0;

    carritoBackend.items.forEach((item) => {
        const itemTotal = item.precioUnitario * item.cantidad;
        subtotal += itemTotal;

        // Validar si la imagen viene en null para poner una por defecto
        const imagen = item.imagenURL ? item.imagenURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzjIJs80nrNS0EvPsj3ZjASYGjjttGoevxHn4r_o0zrgpSWjy7naOhMJiE&s=10";

        // Deshabilitar el botón de menos (-) si la cantidad es 1 o menos
        const isDisabled = item.cantidad <= 1 ? "disabled" : "";

        html += `
            <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <img src="${imagen}" alt="${item.nombreProducto}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded">
                    <div>
                        <h6 class="mb-0 fw-bold small">${item.nombreProducto}</h6>
                        
                        <!-- Controles de cantidad con validación de deshabilitado en 1 -->
                        <div class="d-flex align-items-center mt-2">
                            <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="changeQuantity(${item.idCarritoProductos}, -1)" ${isDisabled}>-</button>
                            <span class="mx-2 small fw-bold">${item.cantidad}</span>
                            <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="changeQuantity(${item.idCarritoProductos}, 1)">+</button>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-bold text-danger d-block">$${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-sm text-danger p-0 border-0 bg-transparent mt-2" onclick="removeItem(${item.idCarritoProductos})"><small>Eliminar</small></button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (subtotalEl) {
        subtotalEl.textContent = `$${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
    }
}

// Función para cambiar cantidad comunicándose con el endpoint POST /api/carritos/actualizar
window.changeQuantity = function (idCarritoProductos, delta) {
    const item = carritoBackend.items.find(i => i.idCarritoProductos === idCarritoProductos);
    if (!item) return;

    const nuevaCantidad = item.cantidad + delta;

    if (nuevaCantidad <= 0) {
        return; // Evita bajar de 1 desde el botón menos
    }

    const url = `http://localhost:8080/api/carritos/actualizar`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idCarritoProductos: idCarritoProductos,
            cantidad: nuevaCantidad,
            idUsuario: idUsuarioGlobal
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al actualizar la cantidad en el servidor");
        }
        return response.json();
    })
    .then(data => {
        // Actualizamos el carrito con la respuesta fresca enviada por el backend
        carritoBackend = data;
        updateCartUI();
    })
    .catch(error => {
        console.error("Hubo un problema:", error);
        alert("No se pudo actualizar la cantidad");
    });
};

// Función para eliminar item comunicándose con el endpoint DELETE /api/carritos/borrar-item
window.removeItem = function (idCarritoProductos) {
    const url = `http://localhost:8080/api/carritos/borrar-item`;

    fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idCarritoProductos: idCarritoProductos,
            cantidad: 0, // Opcional, pero se manda por cumplir con el DTO
            idUsuario: idUsuarioGlobal
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el item en el servidor");
        }
        return response.json();
    })
    .then(data => {
        // Actualizamos el carrito con la respuesta fresca del backend tras eliminar el producto
        carritoBackend = data;
        updateCartUI();
    })
    .catch(error => {
        console.error("Hubo un problema al eliminar:", error);
        alert("No se pudo eliminar el producto del carrito");
    });
};
// --------------------------------------------------------------------------------------------------------------------------------------------------------Cart
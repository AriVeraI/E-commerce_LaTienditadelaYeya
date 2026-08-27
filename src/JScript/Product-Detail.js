// ==========================================================
// Product-Detail.js
// Detalle de producto + variantes
// ==========================================================


// ==========================================================
// CONFIGURACIÓN
// ==========================================================

const API_PRODUCTOS = "http://localhost:8080/productos";

const API_VARIANTES_PRODUCTOS =
    "http://localhost:8080/api/variantes-productos";


// ==========================================================
// OBTENER ID DEL PRODUCTO DESDE LA URL
// ==========================================================

const parametros =
    new URLSearchParams(window.location.search);

const productoId =
    parametros.get("id");


console.log("ID del producto:", productoId);


// ==========================================================
// VARIABLES
// ==========================================================

let productoActual = null;

let variantesProducto = [];

let varianteSeleccionada = null;


// ==========================================================
// INICIO
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {

    if (!productoId) {

        console.error("No se recibió ID del producto.");

        mostrarError("No se encontró el producto.");

        return;
    }


    try {

        await cargarProducto();

        await cargarVariantes();

    } catch (error) {

        console.error(
            "Error al cargar el detalle:",
            error
        );

        mostrarError(
            "No fue posible cargar la información del producto."
        );

    }

});


// ==========================================================
// CARGAR PRODUCTO
// ==========================================================

async function cargarProducto() {

    console.log(
        "Cargando producto:",
        productoId
    );


    const respuesta =
        await fetch(
            `${API_PRODUCTOS}/${productoId}`
        );


    if (!respuesta.ok) {

        throw new Error(
            "No se pudo obtener el producto."
        );

    }


    productoActual =
        await respuesta.json();


    console.log(
        "Producto recibido:",
        productoActual
    );


    pintarProducto();

}


// ==========================================================
// PINTAR PRODUCTO
// ==========================================================

function pintarProducto() {

    const nombre =
        document.getElementById("product-name");

    const descripcion =
        document.getElementById("product-description");

    const precio =
        document.getElementById("product-price");

    const stock =
        document.getElementById("product-stock");

    const imagen =
        document.getElementById("product-image");

    const categoria =
        document.getElementById("product-category");


    // ------------------------------------------------------
    // NOMBRE
    // ------------------------------------------------------

    if (nombre) {

        nombre.textContent =
            productoActual.nombreProducto || "";

    }


    // ------------------------------------------------------
    // DESCRIPCIÓN
    // ------------------------------------------------------

    if (descripcion) {

        descripcion.textContent =
            productoActual.descripcionProducto || "";

    }


    // ------------------------------------------------------
    // PRECIO
    // ------------------------------------------------------

    if (precio) {

        const precioNumero =
            Number(productoActual.precio || 0);


        precio.textContent =
            `$${precioNumero.toFixed(2)}`;

    }


    // ------------------------------------------------------
    // STOCK
    // ------------------------------------------------------

    if (stock) {

        stock.textContent =
            productoActual.stock ?? 0;

    }


    // ------------------------------------------------------
    // CATEGORÍA
    // ------------------------------------------------------

    if (categoria) {

        categoria.textContent =
            productoActual.categoria || "";

    }


    // ------------------------------------------------------
    // IMAGEN
    // ------------------------------------------------------

    if (
        imagen &&
        productoActual.imagen
    ) {

        imagen.src =
            productoActual.imagen;

    } else if (imagen) {

        console.log(
            "El producto no tiene imagen."
        );

        imagen.style.display = "none";

    }

}


// ==========================================================
// CARGAR VARIANTES
// ==========================================================

async function cargarVariantes() {

    console.log(
        "Cargando variantes del producto:",
        productoId
    );


    const respuesta =
        await fetch(
            `${API_VARIANTES_PRODUCTOS}/producto/${productoId}`
        );


    if (!respuesta.ok) {

        throw new Error(
            "No se pudieron obtener las variantes."
        );

    }


    const relaciones =
        await respuesta.json();


    console.log(
        "Variantes recibidas:",
        relaciones
    );


    // ------------------------------------------------------
    // Convertimos la respuesta del backend
    // al formato que necesita el frontend
    // ------------------------------------------------------

    variantesProducto =
        relaciones
            .filter(relacion => relacion.variantes)
            .map(relacion => relacion.variantes);


    console.log(
        "Variantes preparadas:",
        variantesProducto
    );


    pintarVariantes();

}


// ==========================================================
// PINTAR VARIANTES
// ==========================================================

function pintarVariantes() {

    const lista =
        document.getElementById("variants-list");


    if (!lista) {

        console.error(
            "No existe #variants-list"
        );

        return;
    }


    lista.innerHTML = "";


    // ------------------------------------------------------
    // SIN VARIANTES
    // ------------------------------------------------------

    if (
        variantesProducto.length === 0
    ) {

        lista.innerHTML = `
            <span class="text-muted">
                Este producto no tiene variantes.
            </span>
        `;

        return;

    }


    // ------------------------------------------------------
    // CREAR BOTONES
    // ------------------------------------------------------

    variantesProducto.forEach(
        (variante, index) => {

            const boton =
                document.createElement("button");


            boton.type = "button";

            boton.className =
                "btn btn-outline-dark rounded-pill px-4";


            boton.textContent =
                variante.atributos || "Variante";


            boton.dataset.id =
                variante.idVariantes;


            boton.dataset.stock =
                variante.stockVariantes;


            boton.addEventListener(
                "click",
                () => seleccionarVariante(
                    variante,
                    boton
                )
            );


            lista.appendChild(boton);


            // Seleccionar automáticamente
            // la primera variante

            if (index === 0) {

                seleccionarVariante(
                    variante,
                    boton
                );

            }

        }
    );

}


// ==========================================================
// SELECCIONAR VARIANTE
// ==========================================================

function seleccionarVariante(
    variante,
    botonSeleccionado
) {

    varianteSeleccionada =
        variante;


    console.log(
        "Variante seleccionada:",
        variante
    );


    // ------------------------------------------------------
    // Quitar selección de todos
    // ------------------------------------------------------

    const botones =
        document.querySelectorAll(
            "#variants-list button"
        );


    botones.forEach(
        boton => {

            boton.classList.remove(
                "active"
            );

        }
    );


    // ------------------------------------------------------
    // Activar botón seleccionado
    // ------------------------------------------------------

    botonSeleccionado.classList.add(
        "active"
    );


    // ------------------------------------------------------
    // Mostrar stock de variante
    // ------------------------------------------------------

    const stock =
        document.getElementById(
            "product-stock"
        );


    if (stock) {

        stock.textContent =
            variante.stockVariantes ?? 0;

    }


    // ------------------------------------------------------
    // Actualizar cantidad máxima
    // ------------------------------------------------------

    const cantidad =
        document.getElementById(
            "quantity"
        );


    if (cantidad) {

        const stockNumero =
            Number(
                variante.stockVariantes || 0
            );


        cantidad.max =
            stockNumero;


        if (
            Number(cantidad.value) >
            stockNumero
        ) {

            cantidad.value =
                stockNumero > 0
                    ? 1
                    : 0;

        }

    }

}


// ==========================================================
// BOTÓN AGREGAR AL CARRITO
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const boton =
            document.getElementById(
                "add-cart-button"
            );


        if (!boton) {
            return;
        }


        boton.addEventListener(
            "click",
            agregarAlCarrito
        );

    }
);


// ==========================================================
// AGREGAR AL CARRITO
// ==========================================================

function agregarAlCarrito() {

    if (!productoActual) {

        alert(
            "El producto todavía no está cargado."
        );

        return;
    }


    // ------------------------------------------------------
    // Si tiene variantes, debe haber una seleccionada
    // ------------------------------------------------------

    if (
        variantesProducto.length > 0 &&
        !varianteSeleccionada
    ) {

        alert(
            "Selecciona una variante."
        );

        return;
    }


    const cantidadInput =
        document.getElementById(
            "quantity"
        );


    const cantidad =
        Number(
            cantidadInput?.value || 1
        );


    // ------------------------------------------------------
    // Validar cantidad
    // ------------------------------------------------------

    if (cantidad < 1) {

        alert(
            "La cantidad debe ser mayor a cero."
        );

        return;
    }


    // ------------------------------------------------------
    // Validar stock de variante
    // ------------------------------------------------------

    if (varianteSeleccionada) {

        const stockVariante =
            Number(
                varianteSeleccionada.stockVariantes
                || 0
            );


        if (
            cantidad >
            stockVariante
        ) {

            alert(
                "No hay suficiente stock para esta variante."
            );

            return;
        }

    }


    // ------------------------------------------------------
    // Producto para carrito
    // ------------------------------------------------------

    const productoCarrito = {

        id:
            productoActual.idProductos,

        nombre:
            productoActual.nombreProducto,

        precio:
            Number(productoActual.precio || 0),

        imagen:
            productoActual.imagen || "",

        cantidad:
            cantidad,

        variante:
            varianteSeleccionada
                ? {
                    id:
                        varianteSeleccionada.idVariantes,

                    atributo:
                        varianteSeleccionada.atributos,

                    sku:
                        varianteSeleccionada.skuVariantes
                }
                : null

    };


    console.log(
        "Producto agregado al carrito:",
        productoCarrito
    );


    // ------------------------------------------------------
    // Guardar temporalmente en localStorage
    // ------------------------------------------------------

    let carrito =
        JSON.parse(
            localStorage.getItem("carrito")
        ) || [];


    carrito.push(
        productoCarrito
    );


    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    alert(
        "Producto agregado al carrito."
    );

}


// ==========================================================
// MOSTRAR ERROR
// ==========================================================

function mostrarError(mensaje) {

    const nombre =
        document.getElementById(
            "product-name"
        );


    if (nombre) {

        nombre.textContent =
            mensaje;

    }

}
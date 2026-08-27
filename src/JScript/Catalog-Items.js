// ======================================================
// CATALOG-ITEMS.JS
// Catálogo conectado con Spring Boot
// ======================================================

let productosCatalogo = [];

const API_URL = "http://localhost:8080/productos";


// ======================================================
// CARGAR PRODUCTOS DESDE SPRING BOOT
// ======================================================

async function cargarProductos() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al obtener los productos");
        }

        const productos = await respuesta.json();

        console.log("Productos recibidos de Spring:", productos);

        productosCatalogo = productos.map(p => ({

            id: p.idProductos,

            category: p.categoria || "",

            name: p.nombreProducto || "",

            sub: p.descripcionProducto || "",

            price: Number(p.precio) || 0,

            img: p.imagen || ""

        }));

        console.log("Productos preparados para catálogo:", productosCatalogo);

    } catch (error) {

        console.error("Error al cargar productos:", error);

        const grid = document.getElementById("product-grid");

        if (grid) {

            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-danger">
                        No se pudieron cargar los productos.
                    </p>
                </div>
            `;

        }

    }

}


// ======================================================
// INICIAR CATÁLOGO
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    const searchInput =
        document.getElementById("search-input");

    const catCheckboxes =
        document.querySelectorAll(".filter-checkbox");

    const genderCheckboxes =
        document.querySelectorAll(".filter-gender");

    const materialCheckboxes =
        document.querySelectorAll(".filter-material");

    const minPriceInput =
        document.getElementById("price-min");

    const maxPriceInput =
        document.getElementById("price-max");


    // Primero cargamos productos
    await cargarProductos();


    // Después aplicamos filtros
    aplicarFiltros();


    // ==================================================
    // BÚSQUEDA
    // ==================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            aplicarFiltros
        );

    }


    // ==================================================
    // PRECIO
    // ==================================================

    if (minPriceInput) {

        minPriceInput.addEventListener(
            "input",
            aplicarFiltros
        );

    }

    if (maxPriceInput) {

        maxPriceInput.addEventListener(
            "input",
            aplicarFiltros
        );

    }


    // ==================================================
    // CATEGORÍAS
    // ==================================================

    catCheckboxes.forEach(chk => {

        chk.addEventListener("change", event => {

            const valor =
                event.target.value.toLowerCase();


            // Si seleccionamos TODOS
            if (
                valor === "todos" &&
                event.target.checked
            ) {

                catCheckboxes.forEach(c => {

                    if (
                        c.value.toLowerCase() !== "todos"
                    ) {
                        c.checked = false;
                    }

                });

            }


            // Si seleccionamos una categoría
            else if (
                valor !== "todos" &&
                event.target.checked
            ) {

                const todos =
                    document.getElementById("cat-todos");

                if (todos) {
                    todos.checked = false;
                }

            }


            aplicarFiltros();

        });

    });


    // ==================================================
    // GÉNERO
    // ==================================================

    genderCheckboxes.forEach(chk => {

        chk.addEventListener(
            "change",
            aplicarFiltros
        );

    });


    // ==================================================
    // MATERIAL
    // ==================================================

    materialCheckboxes.forEach(chk => {

        chk.addEventListener(
            "change",
            aplicarFiltros
        );

    });


    // ==================================================
    // CATEGORÍA DESDE URL
    // ==================================================

    const parametros =
        new URLSearchParams(window.location.search);

    const categoriaURL =
        parametros.get("categoria");


    if (categoriaURL) {

        catCheckboxes.forEach(chk => {

            if (
                chk.value.toLowerCase() ===
                categoriaURL.toLowerCase()
            ) {

                chk.checked = true;

            }

            if (
                chk.value.toLowerCase() === "todos"
            ) {

                chk.checked = false;

            }

        });

        aplicarFiltros();

    }

});


// ======================================================
// APLICAR FILTROS
// ======================================================

function aplicarFiltros() {

    const searchInput =
        document.getElementById("search-input");

    const catCheckboxes =
        document.querySelectorAll(".filter-checkbox");

    const genderCheckboxes =
        document.querySelectorAll(".filter-gender");

    const materialCheckboxes =
        document.querySelectorAll(".filter-material");

    const minPriceInput =
        document.getElementById("price-min");

    const maxPriceInput =
        document.getElementById("price-max");


    const termino =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const categoriasSeleccionadas =
        Array.from(catCheckboxes)
            .filter(c =>
                c.checked &&
                c.value.toLowerCase() !== "todos"
            )
            .map(c =>
                c.value.toLowerCase()
            );


    const generosSeleccionados =
        Array.from(genderCheckboxes)
            .filter(c => c.checked)
            .map(c =>
                c.value.toLowerCase()
            );


    const materialesSeleccionados =
        Array.from(materialCheckboxes)
            .filter(c => c.checked)
            .map(c =>
                c.value.toLowerCase()
            );


    const todosSeleccionado =
        document.getElementById("cat-todos")?.checked;


    const minimo =
        minPriceInput &&
        minPriceInput.value !== ""
            ? Number(minPriceInput.value)
            : 0;


    const maximo =
        maxPriceInput &&
        maxPriceInput.value !== ""
            ? Number(maxPriceInput.value)
            : Infinity;


    const productosFiltrados =
        productosCatalogo.filter(producto => {

            const nombre =
                producto.name.toLowerCase();

            const descripcion =
                producto.sub.toLowerCase();

            const categoria =
                producto.category.toLowerCase();


            // Búsqueda
            const coincideBusqueda =
                nombre.includes(termino) ||
                descripcion.includes(termino);


            // Categoría
            const coincideCategoria =
                todosSeleccionado ||
                categoriasSeleccionadas.length === 0 ||
                categoriasSeleccionadas.includes(categoria);


            // Precio
            const coincidePrecio =
                producto.price >= minimo &&
                producto.price <= maximo;


            // Género
            // Todavía no viene de nuestra BD
            const coincideGenero = true;


            // Material
            let coincideMaterial = true;


            if (materialesSeleccionados.length > 0) {

                const partes =
                    producto.sub.split("•");

                const material =
                    partes.length > 1
                        ? partes[1].trim().toLowerCase()
                        : "";


                coincideMaterial =
                    materialesSeleccionados.includes(material);

            }


            return (
                coincideBusqueda &&
                coincideCategoria &&
                coincidePrecio &&
                coincideGenero &&
                coincideMaterial
            );

        });


    console.log(
        "Productos después de filtros:",
        productosFiltrados
    );


    renderProducts(productosFiltrados);

}


// ======================================================
// MOSTRAR PRODUCTOS
// ======================================================

function renderProducts(products) {

    const grid =
        document.getElementById("product-grid");


    if (!grid) {
        return;
    }


    if (products.length === 0) {

        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">
                    No se encontraron piezas con estos filtros.
                </p>
            </div>
        `;

        return;

    }


    let html = "";


    products.forEach(producto => {

        html += `

            <div class="col">

                <div
                    class="card h-100 border-0 shadow-sm position-relative producto-card"
                    data-id="${producto.id}"
                    style="cursor: pointer;"
                >

                    <!-- FAVORITO -->

                    <button
                        class="btn btn-wishlist position-absolute top-0 end-0 m-3 border-0"
                        type="button"
                    >
                        <i class="bi bi-heart"></i>
                    </button>


                    <!-- IMAGEN -->

                    <img
                        src="${producto.img}"
                        class="card-img-top"
                        alt="${producto.name}"
                        style="
                            height: 280px;
                            object-fit: cover;
                        "
                    >


                    <!-- INFORMACIÓN -->

                    <div
                        class="card-body d-flex flex-column justify-content-between"
                    >

                        <div>

                            <!-- CATEGORÍA -->

                            <small
                                class="text-muted d-block mb-1"
                            >
                                ${producto.category}
                            </small>


                            <!-- NOMBRE -->

                            <h5
                                class="card-title fw-bold fs-6 mb-2"
                            >
                                ${producto.name}
                            </h5>


                            <!-- DESCRIPCIÓN -->

                            <p
                                class="text-muted small mb-3"
                            >
                                ${producto.sub}
                            </p>

                        </div>


                        <!-- PRECIO Y CARRITO -->

                        <div
                            class="d-flex align-items-center justify-content-between"
                        >

                            <span
                                class="fw-bold fs-5 text-dark"
                            >
                                $${producto.price}
                            </span>


                            <button
                                class="btn btn-outline-dark btn-sm rounded-pill px-3 btn-add-cart"
                                data-id="${producto.id}"
                                data-name="${producto.name}"
                                data-price="${producto.price}"
                                data-image="${producto.img}"
                                type="button"
                            >
                                Agregar
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });


    grid.innerHTML = html;


    // ==================================================
    // CLIC EN TARJETA
    // ==================================================

    const tarjetas =
        document.querySelectorAll(".producto-card");


    tarjetas.forEach(tarjeta => {

        tarjeta.addEventListener("click", event => {

            // No navegar si se presiona AGREGAR
            if (
                event.target.closest(".btn-add-cart")
            ) {
                return;
            }


            // No navegar si se presiona FAVORITO
            if (
                event.target.closest(".btn-wishlist")
            ) {
                return;
            }


            const id =
                tarjeta.dataset.id;


            console.log(
                "Abriendo producto:",
                id
            );


            window.location.href =
                "5_Product-Detail.html?id=" + id;

        });

    });

}
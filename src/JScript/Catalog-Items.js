// catalog.js - Lógica para renderizar dinámicamente los productos del catálogo

const productosCatalogo = [
    { id: "1", category: "Anillos", name: "Pieza Temática 1", sub: "Anillos • Oro 18k", price: 150, img: "../../assets/Images/An1.png" },
    { id: "2", category: "Collares", name: "Pieza Temática 2", sub: "Collares • Plata", price: 260, img: "../../assets/Images/collarazul.png" },
    { id: "3", category: "Pulseras", name: "Pieza Temática 3", sub: "Pulseras • Oro Rosado", price: 370, img: "../../assets/Images/P2.png" },
    { id: "4", category: "Anillos", name: "Pieza Temática 4", sub: "Anillos • Oro 18k", price: 480, img: "../../assets/Images/An4.png" },
    { id: "5", category: "Collares", name: "Pieza Temática 5", sub: "Collares • Plata", price: 590, img: "../../assets/Images/collarabeja.png" },
    { id: "6", category: "Pulseras", name: "Pieza Temática 6", sub: "Pulseras • Oro Rosado", price: 700, img: "../../assets/Images/P4_.png" },
    { id: "7", category: "Anillos", name: "Pieza Temática 7", sub: "Anillos • Oro 18k", price: 810, img: "../../assets/Images/An33.png" },
    { id: "8", category: "Collares", name: "Pieza Temática 8", sub: "Collares • Plata", price: 920, img: "../../assets/Images/collarmar.png" },
    { id: "9", category: "Pulseras", name: "Pieza Temática 9", sub: "Pulseras • Oro Rosado", price: 1030, img: "../../assets/Images/P1.png" },
    { id: "10", category: "Anillos", name: "Pieza Temática 10", sub: "Anillos • Oro 18k", price: 1140, img: "../../assets/Images/An2.png" },
    { id: "11", category: "Collares", name: "Pieza Temática 11", sub: "Collares • Plata", price: 1250, img: "../../assets/Images/collarvaquero.png" },
    { id: "12", category: "Pulseras", name: "Pieza Temática 12", sub: "Pulseras • Oro Rosado", price: 1360, img: "../../assets/Images/P3.png" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(productosCatalogo);

    // Filtro por búsqueda de texto
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = productosCatalogo.filter(p => 
                p.name.toLowerCase().includes(term) || p.sub.toLowerCase().includes(term)
            );
            renderProducts(filtered);
        });
    }

    // Filtros por checkboxes de categoría
    const checkboxes = document.querySelectorAll(".filter-checkbox");
    checkboxes.forEach(chk => {
        chk.addEventListener("change", () => {
            if (chk.value === "todos" && chk.checked) {
                checkboxes.forEach(c => { if(c.value !== "todos") c.checked = false; });
                renderProducts(productosCatalogo);
                return;
            }
            
            // Recoger categorías seleccionadas
            const selectedCats = Array.from(checkboxes)
                .filter(c => c.checked && c.value !== "todos")
                .map(c => c.value);

            if (selectedCats.length === 0) {
                renderProducts(productosCatalogo);
            } else {
                const filtered = productosCatalogo.filter(p => selectedCats.includes(p.category));
                renderProducts(filtered);
            }
        });
    });
});

function renderProducts(products) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No se encontraron piezas con estos filtros.</p></div>`;
        return;
    }

    let html = "";
    products.forEach(p => {
        html += `
            <div class="col">
                <div class="card h-100 border-0 shadow-sm position-relative">
                    <!-- Botón de Favorito -->
                    <button class="btn btn-wishlist position-absolute top-0 end-0 m-3 border-0">
                        <i class="bi bi-heart"></i>
                    </button>
                    <!-- Imagen del producto -->
                    <img src="${p.img}" class="card-img-top" alt="${p.name}" style="height: 280px; object-fit: cover;">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <small class="text-muted d-block mb-1">${p.sub}</small>
                            <h5 class="card-title fw-bold fs-6 mb-3">${p.name}</h5>
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="fw-bold fs-5 text-dark">$${p.price}</span>
                            <button class="btn btn-outline-dark btn-sm rounded-pill px-3 btn-add-cart" 
                                data-id="${p.id}" 
                                data-name="${p.name}" 
                                data-price="${p.price}" 
                                data-image="${p.img}">
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}
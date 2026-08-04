// catalog.js - Lógica para renderizar dinámicamente los productos del catálogo

const productosCatalogo = [
  // NOTA PARA EL FUTURO: Cuando quieras activar los filtros de género y material, 
  // solo debes agregar las propiedades "gender" y "material" a cada producto así:
  // { id: "1", category: "Anillos", gender: "mujer", material: "oro 18k", name: "Pieza Temática 1", sub: "Anillos • Oro 18k", price: 150, img: "../../assets/Images/An1.png" },
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
  // Referencias a los elementos del DOM
  const searchInput = document.getElementById("search-input");
  const catCheckboxes = document.querySelectorAll(".filter-checkbox");
  const genderCheckboxes = document.querySelectorAll(".filter-gender");
  const materialCheckboxes = document.querySelectorAll(".filter-material");
  const minPriceInput = document.getElementById("price-min");
  const maxPriceInput = document.getElementById("price-max");

  // Función central para aplicar todos los filtros al mismo tiempo
  function applyAllFilters() {
    // 1. Obtener término de búsqueda
    const term = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // 2. Obtener valores seleccionados
    const selectedCats = Array.from(catCheckboxes)
      .filter((c) => c.checked && c.value.toLowerCase() !== "todos")
      .map((c) => c.value.toLowerCase());
      
    const selectedGenders = Array.from(genderCheckboxes)
      .filter((c) => c.checked)
      .map((c) => c.value.toLowerCase());
      
    const selectedMaterials = Array.from(materialCheckboxes)
      .filter((c) => c.checked)
      .map((c) => c.value.toLowerCase());

    const isAllChecked = document.getElementById("cat-todos")?.checked;

    // 3. Obtener rangos de precio
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    // 4. Filtrar el arreglo principal
    const filteredProducts = productosCatalogo.filter((p) => {
      // Coincidencia de texto (nombre o subtítulo)
      const matchesSearch = p.name.toLowerCase().includes(term) || p.sub.toLowerCase().includes(term);

      // Coincidencia de categoría
      const matchesCategory = isAllChecked || selectedCats.length === 0 || selectedCats.includes(p.category.toLowerCase());

      // Coincidencia de precio
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

      // --- FILTROS FUTUROS (GÉNERO Y MATERIAL) ---
      
      // Filtro de Género (Sigue comentado para el futuro)
      let matchesGender = true;
      // let matchesGender = selectedGenders.length === 0 || (p.gender && selectedGenders.includes(p.gender.toLowerCase()));
      
      // Filtro de Material (Extraído dinámicamente del 'sub')
      let matchesMaterial = selectedMaterials.length === 0 || 
        (p.sub.includes('•') && selectedMaterials.includes(p.sub.split('•')[1].trim().toLowerCase()));

      // Un producto solo se muestra si cumple con TODOS los filtros activos
      return matchesSearch && matchesCategory && matchesPrice && matchesGender && matchesMaterial;
    });

    renderProducts(filteredProducts);
  }

  // --- Asignar Eventos ---
  if (searchInput) searchInput.addEventListener("input", applyAllFilters);
  if (minPriceInput) minPriceInput.addEventListener("input", applyAllFilters);
  if (maxPriceInput) maxPriceInput.addEventListener("input", applyAllFilters);

  // Eventos para los checkboxes de categoría
  catCheckboxes.forEach((chk) => {
    chk.addEventListener("change", (e) => {
      if (e.target.value.toLowerCase() === "todos" && e.target.checked) {
        catCheckboxes.forEach((c) => {
          if (c.value.toLowerCase() !== "todos") c.checked = false;
        });
      } else if (e.target.value.toLowerCase() !== "todos" && e.target.checked) {
        const todosChk = document.getElementById("cat-todos");
        if (todosChk) todosChk.checked = false;
      }
      applyAllFilters();
    });
  });

  // Eventos para los nuevos checkboxes (reaccionan al hacerles clic)
  genderCheckboxes.forEach((chk) => chk.addEventListener("change", applyAllFilters));
  materialCheckboxes.forEach((chk) => chk.addEventListener("change", applyAllFilters));

  // --- Lógica inicial por si hay parámetros en la URL ---
  const urlParams = new URLSearchParams(window.location.search);
  const categoriaUrl = urlParams.get("categoria");

  if (categoriaUrl) {
    catCheckboxes.forEach((chk) => {
      if (chk.value.toLowerCase() === categoriaUrl.toLowerCase()) {
        chk.checked = true;
      } else if (chk.value.toLowerCase() === "todos") {
        chk.checked = false;
      }
    });
  }

  // Renderizar al cargar la página
  applyAllFilters();
});

// Función para pintar las tarjetas HTML
function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No se encontraron piezas con estos filtros.</p></div>`;
    return;
  }

  let html = "";
  products.forEach((p) => {
    html += `
            <div class="col">
                <div class="card h-100 border-0 shadow-sm position-relative">
                    <button class="btn btn-wishlist position-absolute top-0 end-0 m-3 border-0">
                        <i class="bi bi-heart"></i>
                    </button>
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
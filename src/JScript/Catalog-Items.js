let productosCatalogo = [];
let paginaActual = 1;
const PAGE_SIZE = 6;

function tipoPorProducto(p) {
  const sku = String(p.sku || "").toUpperCase();
  if (sku.startsWith("ANI")) return "Anillos";
  if (sku.startsWith("COL")) return "Collares";
  if (sku.startsWith("PUL")) return "Pulseras";
  if (sku.startsWith("ARE")) return "Pendientes";
  return p.categorias?.[0] || "Joyeria";
}

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const catCheckboxes = document.querySelectorAll(".filter-checkbox");
  const dbCategoryFilter = document.getElementById("db-category-filter");
  const minPriceInput = document.getElementById("price-min");
  const maxPriceInput = document.getElementById("price-max");

  function applyAllFilters(resetPage=true) {
    if(resetPage) paginaActual=1;
    const term = (searchInput?.value || "").toLowerCase().trim();
    const selectedCats = [...catCheckboxes].filter(c => c.checked && c.value.toLowerCase() !== "todos").map(c => c.value.toLowerCase());
    const isAll = document.getElementById("cat-todos")?.checked;
    const dbCategory = (dbCategoryFilter?.value || "").toLowerCase();
    const min = Number(minPriceInput?.value) || 0;
    const max = Number(maxPriceInput?.value) || Infinity;
    const filtered=productosCatalogo.filter(p => {
      const text = `${p.name} ${p.sub} ${p.sku}`.toLowerCase();
      return text.includes(term)
        && (isAll || !selectedCats.length || selectedCats.includes(p.category.toLowerCase()))
        && (!dbCategory || (p.categories || []).some(c => c.toLowerCase() === dbCategory))
        && p.price >= min && p.price <= max;
    });
    renderProducts(filtered);
  }

  searchInput?.addEventListener("input", () => applyAllFilters());
  minPriceInput?.addEventListener("input", () => applyAllFilters());
  maxPriceInput?.addEventListener("input", () => applyAllFilters());
  dbCategoryFilter?.addEventListener("change", () => applyAllFilters());
  catCheckboxes.forEach(chk => chk.addEventListener("change", e => {
    if (e.target.value.toLowerCase() === "todos" && e.target.checked) catCheckboxes.forEach(c => { if (c !== e.target) c.checked = false; });
    else if (e.target.checked) { const all = document.getElementById("cat-todos"); if (all) all.checked = false; }
    if (![...catCheckboxes].some(c => c.checked)) { const all = document.getElementById("cat-todos"); if (all) all.checked = true; }
    applyAllFilters();
  }));

  const categoriaUrl = new URLSearchParams(location.search).get("categoria");
  if (categoriaUrl) catCheckboxes.forEach(c => c.checked = c.value.toLowerCase() === categoriaUrl.toLowerCase());

  try {
    const response = await fetch(window.YeyaApi.url("/api/products/catalog"));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    productosCatalogo = data.map(p => ({
      id: p.idProductos, sku: p.sku, category: tipoPorProducto(p), categories: p.categorias || [],
      name: p.nombreProducto, sub: p.descripcionProducto || "Pieza de La Tiendita de la Yeya",
      price: Number(p.precio), stock: Number(p.stock || 0),
      available: String(p.disponibilidad || "").toLowerCase() !== "agotado" && Number(p.stock || 0) > 0,
      img: p.imagen || "../../assets/Images/An1.png",
    }));
    if (dbCategoryFilter) {
      const categorias = [...new Set(productosCatalogo.flatMap(p => p.categories || []))].sort();
      dbCategoryFilter.innerHTML = '<option value="">Todas las categorías</option>' + categorias.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    applyAllFilters();
  } catch (error) {
    console.error("No se pudo cargar el catálogo:", error);
    const grid = document.getElementById("product-grid");
    if (grid) grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-danger">No se pudo conectar con el catálogo.</p></div>';
  }
});

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const totalPaginas=Math.max(1,Math.ceil(products.length/PAGE_SIZE));
  if(paginaActual>totalPaginas)paginaActual=totalPaginas;
  const visible=products.slice((paginaActual-1)*PAGE_SIZE,paginaActual*PAGE_SIZE);
  if (!products.length) grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No se encontraron piezas con estos filtros.</p></div>';
  else grid.innerHTML = visible.map(p => `
    <div class="col"><div class="card h-100 border-0 shadow-sm position-relative">
      <a href="5_Product-Detail.html?id=${p.id}" class="text-decoration-none text-dark"><img src="${p.img}" onerror="this.src='../../assets/Images/An1.png'" class="card-img-top" alt="${p.name}" style="height:280px;object-fit:cover;"></a>
      <div class="card-body d-flex flex-column justify-content-between"><div>
        <small class="text-muted d-block mb-1">${p.category} · ${p.sub}</small>
        <a href="5_Product-Detail.html?id=${p.id}" class="text-decoration-none text-dark"><h5 class="card-title fw-bold fs-6 mb-2">${p.name}</h5></a>
        <small class="${p.available ? 'text-success' : 'text-danger'}">${p.available ? `Stock: ${p.stock}` : 'Agotado'}</small>
      </div><div class="d-flex align-items-center justify-content-between mt-3">
        <span class="fw-bold fs-5 text-dark">$${p.price.toFixed(2)}</span>
        <button class="btn btn-outline-dark btn-sm rounded-pill px-3 btn-add-cart" ${p.available ? '' : 'disabled'} data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.img}" data-stock="${p.stock}">Agregar</button>
      </div></div></div></div>`).join("");
  renderPagination(totalPaginas,products);
}

function renderPagination(totalPaginas, products){
  const ul=document.querySelector('.pagination'); if(!ul)return;
  if(totalPaginas<=1){ul.parentElement.style.display='none';return;}
  ul.parentElement.style.display='flex';
  const item=(label,page,disabled=false,active=false)=>`<li class="page-item ${disabled?'disabled':''} ${active?'active':''}"><a class="page-link ${active?'bg-danger border-danger':'text-dark'}" href="#" data-page="${page}">${label}</a></li>`;
  let html=item('&laquo;',paginaActual-1,paginaActual===1);
  for(let p=1;p<=totalPaginas;p++)html+=item(p,p,false,p===paginaActual);
  html+=item('&raquo;',paginaActual+1,paginaActual===totalPaginas);
  ul.innerHTML=html;
  ul.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const p=Number(a.dataset.page);if(p<1||p>totalPaginas||p===paginaActual)return;paginaActual=p;renderProducts(products);window.scrollTo({top:0,behavior:'smooth'});}));
}

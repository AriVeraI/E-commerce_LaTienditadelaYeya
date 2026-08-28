const params = new URLSearchParams(window.location.search);
const productoId = params.get("id");
let productoEnEdicion = null;
let catalogoEnEdicion = null;

const nameProduct = document.getElementById("titulo-producto");
const category = document.getElementById("categoria-producto");
const typeProduct = document.getElementById("tipo-producto");
const stock = document.getElementById("stock-producto");
const image = document.getElementById("imagen-producto");
const price = document.getElementById("precio-producto");
const description = document.getElementById("descripcion-producto");
const form = document.getElementById("mainForm");
const submitButton = form?.querySelector('button[type="submit"]');

function tipoDesdeSku(sku) {
  const p = String(sku || "").slice(0,3).toUpperCase();
  return ({ANI:"Anillos", COL:"Collares", PUL:"Pulseras", ARE:"Pendientes"})[p] || "Collares";
}

async function api(path, options={}) {
  const res=await fetch(window.YeyaApi.url(path), {...options, headers:window.YeyaAuth.authHeaders(options.headers||{})});
  if(!res.ok){let m='No se pudo completar la operación.';try{const j=await res.json();m=j.detail||j.message||m;}catch(_){ }throw new Error(m);}
  return res.status===204?null:res.json();
}

async function cargarCategorias() {
  const cats = await api("/api/categorias");
  category.innerHTML = '<option value="">Selecciona una categoría</option>' + cats.map(c =>
    `<option value="${c.idCategoria}">${c.nombreCategoria}</option>`).join("");
}

async function cargarEdicion() {
  if (!productoId) return;
  const [p, catalogo] = await Promise.all([
    api(`/api/products/${productoId}`),
    api(`/api/products/${productoId}/catalog`)
  ]);
  productoEnEdicion = p;
  catalogoEnEdicion = catalogo;
  nameProduct.value = p.nombreProducto || "";
  price.value = p.precio || "";
  description.value = p.descripcionProducto || "";
  stock.value = p.stock ?? 0;
  typeProduct.value = tipoDesdeSku(p.sku);
  if (catalogo?.imagen) image.value = catalogo.imagen;
  if (catalogo?.categorias?.length) {
    const found=[...category.options].find(o=>o.textContent===catalogo.categorias[0]);
    if(found) category.value=found.value;
  }
  const title = document.querySelector(".titulo-negro");
  if (title) title.textContent = "Editar producto";
  if (submitButton) submitButton.textContent = "Guardar cambios";
}

function payload(){
  return {
    nombreProducto:nameProduct.value.trim(),
    descripcionProducto:description.value.trim(),
    precio:Number(price.value),
    stock:Number(stock.value),
    tipoPieza:typeProduct.value,
    categoriaId:Number(category.value),
    imagen:image.value
  };
}

async function guardarProducto() {
  const p=payload();
  if (!p.nombreProducto || !p.categoriaId || !p.descripcionProducto || !Number.isFinite(p.precio) || p.precio<=0 || !Number.isInteger(p.stock) || p.stock<0 || !p.imagen) {
    alert("Completa nombre, categoría, descripción, precio, stock e imagen con valores válidos."); return;
  }
  const editando=Boolean(productoId && productoEnEdicion);
  const path=editando?`/api/admin/products/${productoId}`:'/api/admin/products';
  await api(path,{method:editando?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
  alert(editando ? "¡Producto actualizado correctamente!" : "¡Producto guardado correctamente!");
  location.href="9_A-Panel-Products.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  try { await cargarCategorias(); await cargarEdicion(); }
  catch(e){ console.error(e); alert(e.message||"No se pudo preparar el formulario de producto."); }
});
form?.addEventListener("submit", async e => { e.preventDefault(); try { await guardarProducto(); } catch(err){ console.error(err); alert(err.message||"No se pudo guardar el producto."); } });

/*  LÓGICA DE CONFIRMACIÓN DE PEDIDO */

document.addEventListener('DOMContentLoaded', () => {

    // GENERACIÓN DEL NÚMERO DE PEDIDO ALEATORIO (#YEYA-XXXXX)

    function generarNumeroPedido() {
        const elementoNumeroPedido = document.getElementById('numero-pedido');
        // Genera un número entero aleatorio de 5 dígitos (entre 10000 y 99999)
        const numeroAleatorio = Math.floor(10000 + Math.random() * 90000);
        const codigoFinal = `#YEYA-${numeroAleatorio}`;
        
        if (elementoNumeroPedido) {
            elementoNumeroPedido.textContent = codigoFinal;
        }
    }

    // ESUMEN DE COMPRA DESDE EL LOCALSTORAGE

    function cargarResumenCompra() {
        const contenedorProductos = document.getElementById('contenedor-productos-resumen');
        const elementoSubtotal = document.getElementById('subtotal-compra');
        const elementoEnvio = document.getElementById('envio-compra');
        const elementoTotal = document.getElementById('total-compra');

        // Leer el 'ultimoPedido' que guardamos en el Checkout antes de vaciar el 'cart'
        const productosPedido = JSON.parse(localStorage.getItem('ultimoPedido')) || [];

        // Si no hay datos
        if (productosPedido.length === 0) {
            contenedorProductos.innerHTML = '<p class="text-muted small text-center my-3">No se encontraron detalles del pedido reciente.</p>';
            return;
        }

        
        contenedorProductos.innerHTML = '';
        let subtotalCalculado = 0;

        
        productosPedido.forEach(producto => {
            
            const precio = parseFloat(producto.price);
            const cantidad = parseInt(producto.quantity);
            const costoItemTotal = precio * cantidad;
            
            subtotalCalculado += costoItemTotal;

            // Si el objeto del carrito no tiene imagen, ponemos un recuadro gris por defecto
            const imagenSrc = producto.image || 'https://via.placeholder.com/50/F2F4F6/C66271?text=Yeya';

            // Inyectamos el HTML de la tarjeta miniatura
            const htmlItem = `
                <div class="item-producto-resumen d-flex align-items-center justify-content-between gap-3 border-bottom pb-2 mb-2">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${imagenSrc}" alt="${producto.name}" class="imagen-miniatura-producto" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                        <div>
                            <span class="nombre-item-producto d-block fw-bold" style="font-size: 0.9rem; color: #30343F;">${producto.name}</span>
                            <span class="detalles-item-producto text-muted" style="font-size: 0.8rem;">Cant: ${cantidad} x $${precio.toFixed(2)} MXN</span>
                        </div>
                    </div>
                    <span class="precio-item-producto fw-bold" style="color: #C66271; font-size: 0.9rem;">$${costoItemTotal.toFixed(2)} MXN</span>
                </div>
            `;
            contenedorProductos.innerHTML += htmlItem;
        });


        const costoEnvio = 99.00; 
        const totalCalculado = subtotalCalculado + costoEnvio;

        // Imprimir totales formateados con 2 decimales
        if (elementoSubtotal) elementoSubtotal.textContent = `$${subtotalCalculado.toFixed(2)} MXN`;
        if (elementoEnvio) elementoEnvio.textContent = `$${costoEnvio.toFixed(2)} MXN`;
        if (elementoTotal) elementoTotal.textContent = `$${totalCalculado.toFixed(2)} MXN`;
    }


    generarNumeroPedido();
    cargarResumenCompra();

});
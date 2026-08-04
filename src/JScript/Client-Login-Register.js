/* =======================================================
   LÓGICA DE VALIDACIÓN Y FUNCIONALIDAD - REGISTRO
   Desarrollado para: La Tiendita de la Yeya
======================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. OBTENCIÓN DE ELEMENTOS DEL DOM
    const formulario = document.getElementById('formulario-registro');
    
    // Campos de entrada
    const inputNombre = document.getElementById('nombre-completo');
    const inputCorreo = document.getElementById('correo-electronico');
    const inputTelefono = document.getElementById('numero-telefono');
    const inputClave = document.getElementById('clave-usuario');
    const inputConfirmar = document.getElementById('confirmar-clave');
    const checkTerminos = document.getElementById('acepto-terminos');

    // Botones de ver/ocultar contraseña
    const btnToggleClave1 = document.getElementById('toggle-clave-1');
    const btnToggleClave2 = document.getElementById('toggle-clave-2');

    //FUNCIONALIDAD: MOSTRAR / OCULTAR CONTRASEÑA
    
    function alternarVisibilidadClave(inputCampo, botonBuscado) {
        // Seleccionamos la etiqueta <i> de Bootstrap Icons
        const icono = botonBuscado.querySelector('i');
        
        if (inputCampo.type === 'password') {
            inputCampo.type = 'text'; // Muestra el texto
            icono.classList.remove('bi-eye');
            icono.classList.add('bi-eye-slash'); // Cambia a ojo tachado
        } else {
            inputCampo.type = 'password'; // Oculta el texto
            icono.classList.remove('bi-eye-slash');
            icono.classList.add('bi-eye'); // Cambia a ojo normal
        }
    }

    // Escuchadores para los botones de ojito
    btnToggleClave1.addEventListener('click', () => alternarVisibilidadClave(inputClave, btnToggleClave1));
    btnToggleClave2.addEventListener('click', () => alternarVisibilidadClave(inputConfirmar, btnToggleClave2));

    // RESTRICCIÓN: SOLO NÚMEROS EN EL TELÉFONO
    inputTelefono.addEventListener('input', (e) => {
        // Borra al instante cualquier letra o símbolo
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    //FUNCIONES DE VALIDACIÓN
    function esCorreoValido(correo) {
        // Expresión regular que exige el @ y un dominio
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexCorreo.test(correo);
    }

    function esTelefonoValido(telefono) {
        // Exige exactamente 10 números
        return /^\d{10}$/.test(telefono);
    }

    function marcarCampo(inputElemento, esValido) {
        if (esValido) {
            inputElemento.classList.remove('is-invalid');
            inputElemento.classList.add('is-valid');
        } else {
            inputElemento.classList.remove('is-valid');
            inputElemento.classList.add('is-invalid');
        }
    }

    // EVENTO DE ENVÍO DEL FORMULARIO
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Evita que la página recargue de golpe

        let formularioEsValido = true;

        // Validar Nombre
        if (inputNombre.value.trim().length < 3) {
            marcarCampo(inputNombre, false);
            formularioEsValido = false;
        } else {
            marcarCampo(inputNombre, true);
        }

        // Validar Correo
        if (!esCorreoValido(inputCorreo.value.trim())) {
            marcarCampo(inputCorreo, false);
            formularioEsValido = false;
        } else {
            marcarCampo(inputCorreo, true);
        }

        // Validar Teléfono (10 dígitos)
        if (!esTelefonoValido(inputTelefono.value.trim())) {
            marcarCampo(inputTelefono, false);
            formularioEsValido = false;
        } else {
            marcarCampo(inputTelefono, true);
        }

        // Validar Contraseña (Min 6 caracteres)
        const claveValor = inputClave.value;
        if (claveValor.length < 6) {
            marcarCampo(inputClave, false);
            formularioEsValido = false;
        } else {
            marcarCampo(inputClave, true);
        }

        // Validar Confirmación de Contraseña
        if (inputConfirmar.value === '' || inputConfirmar.value !== claveValor) {
            marcarCampo(inputConfirmar, false);
            formularioEsValido = false;
        } else {
            marcarCampo(inputConfirmar, true);
        }

        // Validar Términos y Condiciones
        if (!checkTerminos.checked) {
            checkTerminos.classList.add('is-invalid');
            formularioEsValido = false;
        } else {
            checkTerminos.classList.remove('is-invalid');
            checkTerminos.classList.add('is-valid');
        }


        // CREACIÓN DE CUENTA EXITOSA
        if (formularioEsValido) {
            // Guardamos el correo en el LocalStorage
            localStorage.setItem('nuevoUsuarioEmail', inputCorreo.value.trim());

            // Alerta nativa para notificar al cliente
            alert('¡Cuenta creada con éxito! Bienvenida(o) a La Tiendita de la Yeya. Serás redirigido para iniciar sesión.');

            // REDIRECCIÓN a la página de Login que está en tu HTML
            window.location.href = '8_Client-Login.html';
        }
    });

});
/* LÓGICA DE VALIDACIÓN Y FUNCIONALIDAD */

document.addEventListener("DOMContentLoaded", () => {
  // 1. OBTENCIÓN DE ELEMENTOS DEL DOM
  const formulario = document.getElementById("formulario-registro");

  // Campos de entrada
  const inputNombre = document.getElementById("nombre-completo");
  const inputCorreo = document.getElementById("correo-electronico");
  const inputTelefono = document.getElementById("numero-telefono");
  const inputClave = document.getElementById("clave-usuario");
  const inputConfirmar = document.getElementById("confirmar-clave");
  const checkTerminos = document.getElementById("acepto-terminos");
  const errorClave = document.getElementById("error-clave");
  const errorConfirmar = document.getElementById("error-confirmar");

  // Botones de ver/ocultar contraseña
  const btnToggleClave1 = document.getElementById("toggle-clave-1");
  const btnToggleClave2 = document.getElementById("toggle-clave-2");

  //FUNCIONALIDAD: MOSTRAR / OCULTAR CONTRASEÑA

  function alternarVisibilidadClave(inputCampo, botonBuscado) {
    // Seleccionamos la etiqueta <i> de Bootstrap Icons
    const icono = botonBuscado.querySelector("i");

    if (inputCampo.type === "password") {
      inputCampo.type = "text"; // Muestra el texto
      icono.classList.remove("bi-eye");
      icono.classList.add("bi-eye-slash"); // Cambia a ojo tachado
    } else {
      inputCampo.type = "password"; // Oculta el texto
      icono.classList.remove("bi-eye-slash");
      icono.classList.add("bi-eye"); // Cambia a ojo normal
    }
  }

  // Escuchadores para los botones de ojito
  btnToggleClave1.addEventListener("click", () =>
    alternarVisibilidadClave(inputClave, btnToggleClave1),
  );
  btnToggleClave2.addEventListener("click", () =>
    alternarVisibilidadClave(inputConfirmar, btnToggleClave2),
  );

  // RESTRICCIÓN: SOLO NÚMEROS EN EL TELÉFONO
  inputTelefono.addEventListener("input", (e) => {
    // Borra al instante cualquier letra o símbolo
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
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
      inputElemento.classList.remove("is-invalid");
      inputElemento.classList.add("is-valid");
    } else {
      inputElemento.classList.remove("is-valid");
      inputElemento.classList.add("is-invalid");
    }
  }

  // EVENTO DE ENVÍO DEL FORMULARIO
  formulario.addEventListener("submit", (evento) => {
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
    if (claveValor.length <= 6) {
      marcarCampo(inputClave, false);
      errorClave.classList.add("d-block");
      formularioEsValido = false;
    } else {
      marcarCampo(inputClave, true);
      errorClave.classList.remove("d-block");
    }

    // Validar Confirmación de Contraseña
    if (inputConfirmar.value === "" || inputConfirmar.value !== claveValor) {
      marcarCampo(inputConfirmar, false);
      errorConfirmar.classList.add("d-block");
      formularioEsValido = false;
    } else {
      marcarCampo(inputConfirmar, true);
      errorConfirmar.classList.remove("d-block");
    }

    // Validar Términos y Condiciones
    if (!checkTerminos.checked) {
      checkTerminos.classList.add("is-invalid");
      formularioEsValido = false;
    } else {
      checkTerminos.classList.remove("is-invalid");
      checkTerminos.classList.add("is-valid");
    }

    // CREACIÓN DE CUENTA EXITOSA
    if (formularioEsValido) {
      //Obj para el usuario registrado
      const nvoUsuario = {
          nombre: inputNombre.value.trim(),
          correo: inputCorreo.value.trim(),
          telefono: inputTelefono.value.trim(),
          clave:  btoa(encodeURIComponent(inputClave.value))
      };

      //lista para los usuarios, se inicializa en un array vacio 
      let listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];   
      //en caso de que el correo se repita y evitar que el local Storage lo sobre escriba 
      const correoExistente = listaUsuarios.find(usuario => usuario.correo === nvoUsuario.correo);
      if (correoExistente) {
          alert('Este correo ya está vinculado a una cuenta');
          marcarCampo(inputCorreo, false);
          return; 
      }
      //Agregando el user a la lista
      listaUsuarios.push(nvoUsuario);
      
      localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
      //console.log(listaUsuarios);


      // Alerta nativa para notificar al cliente
      alert(
        "¡Cuenta creada con éxito! Bienvenida(o) a La Tiendita de la Yeya. Serás redirigido para iniciar sesión.",
      );

      // REDIRECCIÓN a la página de Login que está en tu HTML
      window.location.href = "8_Client-Login.html";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal-terminos");
  const btnAbrir = document.getElementById("btn-abrir-terminos");
  const btnCerrar = document.getElementById("btn-cerrar-modal");

  // Abrir modal
  btnAbrir.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
  });

  // Cerrar modal con la "X"
  btnCerrar.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Cerrar modal haciendo clic fuera de la cajita blanca
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });


});


  // Cerrar modal presionando la tecla Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "flex") {
      modal.style.display = "none";
    }
  });

//---------------------------------- SCRIPT LOGIN---------------

document.addEventListener('DOMContentLoaded', () => {
  // Capturamos los elementos del HTML
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('exampleInputEmail1');
  const passwordInput = document.getElementById('exampleInputPassword1');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Expresión regular para validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que se recargue la página

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // NUEVA CONDICIÓN: Si AMBOS campos están vacíos al hacer clic
    if (emailValue === '' && passwordValue === '') {
      alert('Por favor completa los campos del formulario. No has ingresado ninguna información.');
      showError(emailInput, emailError, 'El correo electrónico es obligatorio.');
      showError(passwordInput, passwordError, 'La contraseña es obligatoria.');
      return; // Detenemos la ejecución aquí
    }

    let isValid = true;

    // --- 1. Validar Correo Electrónico ---
    if (emailValue === '') {
      showError(emailInput, emailError, 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      showError(emailInput, emailError, 'Ingresa un correo electrónico con formato válido.');
      isValid = false;
    } else {
      showSuccess(emailInput, emailError);
    }

    // --- 2. Validar Contraseña ---
    if (passwordValue === '') {
      showError(passwordInput, passwordError, 'La contraseña es obligatoria.');
      isValid = false;
    } else if (passwordValue.length < 6) {
      showError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    } else {
      showSuccess(passwordInput, passwordError);
    }

    // --- 3. Si todo es válido ---
    if (isValid) {
      console.log('Datos listos para enviar:', {
        email: emailValue,
        password: passwordValue
      });
      //alert('¡Inicio de sesión exitoso!');
      
      checkloging ()
      // loginForm.submit();
    }
  });

  // Limpiar/Validar dinámicamente mientras el usuario escribe
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) {
      clearStatus(emailInput, emailError);
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('is-invalid')) {
      clearStatus(passwordInput, passwordError);
    }
  });

  // --- Funciones Auxiliares para clases de Bootstrap ---
  function showError(input, errorElement, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function showSuccess(input, errorElement) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  function clearStatus(input, errorElement) {
    input.classList.remove('is-invalid', 'is-valid');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
});

// Función login
function checkloging () {
  const emailInput = document.getElementById("exampleInputEmail1").value;
  let listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];   
  const usuarioExistente = listaUsuarios.find(usuario => usuario.correo === emailInput);
    if (usuarioExistente) {
      const contraInput = document.getElementById ("exampleInputPassword1").value;
      if (usuarioExistente.clave === btoa(encodeURIComponent(contraInput))) {
        alert ('Bienvenido');
      } else {
          alert ('La contraseña no es correcta');

      }
    } else {
      alert ('El correo no está registrado');
    }
}


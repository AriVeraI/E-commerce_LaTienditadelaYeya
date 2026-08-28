/* LÓGICA UNIFICADA DE VALIDACIÓN, MODAL Y CONEXIÓN AL BACKEND */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. CONTROL DEL MODAL DE TÉRMINOS Y CONDICIONES (CORREGIDO)
  // =========================================================================
  const modalTerminos = document.getElementById("modal-terminos");
  const btnAbrir = document.getElementById("btn-abrir-terminos");
  const btnCerrar = document.getElementById("btn-cerrar-modal");

  if (btnAbrir && modalTerminos && btnCerrar) {
    btnAbrir.addEventListener("click", (e) => {
      e.preventDefault();
      modalTerminos.style.display = "flex";
    });

    btnCerrar.addEventListener("click", () => {
      modalTerminos.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === modalTerminos) {
        modalTerminos.style.display = "none";
      }
    });

    // Movido aquí adentro para que reconozca la variable 'modalTerminos' sin errores
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modalTerminos.style.display === "flex") {
        modalTerminos.style.display = "none";
      }
    });
  }

  // =========================================================================
  // 2. SECCIÓN DE REGISTRO DE USUARIOS
  // =========================================================================
  const formularioRegistro = document.getElementById("formulario-registro");
  const inputNombre = document.getElementById("nombre-completo");
  const inputCorreo = document.getElementById("correo-electronico");
  const inputTelefono = document.getElementById("numero-telefono");
  const inputClave = document.getElementById("clave-usuario");
  const inputConfirmar = document.getElementById("confirmar-clave");
  const checkTerminos = document.getElementById("acepto-terminos");
  const errorClave = document.getElementById("error-clave");
  const errorConfirmar = document.getElementById("error-confirmar");

  const btnToggleClave1 = document.getElementById("toggle-clave-1");
  const btnToggleClave2 = document.getElementById("toggle-clave-2");

  if (btnToggleClave1 && btnToggleClave2) {
    function alternarVisibilidadClave(inputCampo, botonBuscado) {
      const icono = botonBuscado.querySelector("i");
      if (inputCampo.type === "password") {
        inputCampo.type = "text";
        icono.classList.remove("bi-eye");
        icono.classList.add("bi-eye-slash");
      } else {
        inputCampo.type = "password";
        icono.classList.remove("bi-eye-slash");
        icono.classList.add("bi-eye");
      }
    }

    btnToggleClave1.addEventListener("click", () =>
      alternarVisibilidadClave(inputClave, btnToggleClave1),
    );
    btnToggleClave2.addEventListener("click", () =>
      alternarVisibilidadClave(inputConfirmar, btnToggleClave2),
    );
  }

  if (inputTelefono) {
    inputTelefono.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
  }

  function esCorreoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }

  function esTelefonoValido(telefono) {
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

  if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", (evento) => {
      evento.preventDefault();
      let formularioEsValido = true;
      const claveValor = inputClave.value;

      if (inputNombre.value.trim().length < 3) {
        marcarCampo(inputNombre, false);
        formularioEsValido = false;
      } else {
        marcarCampo(inputNombre, true);
      }
      if (!esCorreoValido(inputCorreo.value.trim())) {
        marcarCampo(inputCorreo, false);
        formularioEsValido = false;
      } else {
        marcarCampo(inputCorreo, true);
      }
      if (!esTelefonoValido(inputTelefono.value.trim())) {
        marcarCampo(inputTelefono, false);
        formularioEsValido = false;
      } else {
        marcarCampo(inputTelefono, true);
      }

      if (claveValor.length <= 6) {
        marcarCampo(inputClave, false);
        errorClave.classList.add("d-block");
        formularioEsValido = false;
      } else {
        marcarCampo(inputClave, true);
        errorClave.classList.remove("d-block");
      }

      if (inputConfirmar.value === "" || inputConfirmar.value !== claveValor) {
        marcarCampo(inputConfirmar, false);
        errorConfirmar.classList.add("d-block");
        formularioEsValido = false;
      } else {
        marcarCampo(inputConfirmar, true);
        errorConfirmar.classList.remove("d-block");
      }

      if (!checkTerminos.checked) {
        checkTerminos.classList.add("is-invalid");
        formularioEsValido = false;
      } else {
        checkTerminos.classList.remove("is-invalid");
        checkTerminos.classList.add("is-valid");
      }

      if (!formularioEsValido) {
        // ... (Tus alertas SweetAlert2 se mantienen exactamente idénticas aquí)
        return;
      }

      if (formularioEsValido) {
        // NUEVO: Enviamos el nuevo usuario directamente a la base de datos de Spring Boot
        const nvoUsuario = {
          nombre: inputNombre.value.trim(),
          correo: inputCorreo.value.trim(),
          telefono: inputTelefono.value.trim(),
          clave: claveValor, // Mandamos la clave limpia; la seguridad/hash se maneja mejor en el Backend
        };

        fetch(window.YeyaApi.url("/api/users/register"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nvoUsuario),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                icon: "success",
                title: "¡Felicitaciones!",
                text: "Creaste tu cuenta con éxito en el servidor. Serás redirigido al inicio de sesión.",
                confirmButtonColor: "#C66271",
                confirmButtonText: "Aceptar",
              }).then(() => {
                window.location.href = "8_Client-Login.html";
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Este correo ya está registrado en el sistema.",
              });
            }
          })
          .catch((err) =>
            console.error("Error al registrar usuario en el servidor:", err),
          );
      }
    });
  }

  // =========================================================================
  // 3. SECCIÓN DE INICIO DE SESIÓN (LOGIN)
  // =========================================================================
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("exampleInputEmail1");
  const passwordInput = document.getElementById("exampleInputPassword1");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailValue = emailInput.value.trim();
      const passwordValue = passwordInput.value.trim();

      if (emailValue === "" && passwordValue === "") {
        alert("Por favor completa los campos del formulario.");
        showError(
          emailInput,
          emailError,
          "El correo electrónico es obligatorio.",
        );
        showError(
          passwordInput,
          passwordError,
          "La contraseña es obligatoria.",
        );
        return;
      }

      let isValid = true;

      if (emailValue === "") {
        showError(
          emailInput,
          emailError,
          "El correo electrónico es obligatorio.",
        );
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        showError(emailInput, emailError, "Ingresa un correo válido.");
        isValid = false;
      } else {
        showSuccess(emailInput, emailError);
      }

      if (passwordValue === "") {
        showError(
          passwordInput,
          passwordError,
          "La contraseña es obligatoria.",
        );
        isValid = false;
      } else if (passwordValue.length < 6) {
        showError(passwordInput, passwordError, "Mínimo 6 caracteres.");
        isValid = false;
      } else {
        showSuccess(passwordInput, passwordError);
      }

      if (isValid) {
        // NUEVO: En lugar de usar localStorage, llamamos a la función conectada con fetch
        checkLoginConBackend(emailValue, passwordValue);
      }
    });

    emailInput.addEventListener("input", () => {
      if (emailInput.classList.contains("is-invalid"))
        clearStatus(emailInput, emailError);
    });
    passwordInput.addEventListener("input", () => {
      if (passwordInput.classList.contains("is-invalid"))
        clearStatus(passwordInput, passwordError);
    });
  }

  function showError(input, errorElement, message) {
    input.classList.add("is-invalid");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
  function showSuccess(input, errorElement) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    errorElement.style.display = "none";
  }
  function clearStatus(input, errorElement) {
    input.classList.remove("is-invalid", "is-valid");
    errorElement.style.display = "none";
  }
  // NUEVA FUNCIÓN: Comprueba las credenciales directamente contra la base de datos MySQL
  function checkLoginConBackend(email, password) {
    const credenciales = {
      correo: email,
      clave: password,
    };

    fetch(window.YeyaApi.url("/api/users/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    })
      .then(async (response) => {
        if (response.ok) {
          const usuario = await response.json();
          sessionStorage.setItem("usuarioActual", JSON.stringify(usuario));
          alert(`¡Bienvenido, ${usuario.nombreCompleto}!`);

          const rol = String(usuario.rol || "").toLowerCase();
          const destinoPendiente = sessionStorage.getItem("yeyaPostLoginRedirect");
          sessionStorage.removeItem("yeyaPostLoginRedirect");

          if (rol === "admin") {
            window.location.href = "9_A-Panel-Estadistica.html";
          } else {
            window.location.href = destinoPendiente || "1_Index.html";
          }
        } else if (response.status === 401) {
          alert("Correo o contraseña incorrectos.");
        } else {
          alert("No fue posible iniciar sesión.");
        }
      })
      .catch((err) => {
        console.error("Error al conectar login con backend:", err);
        alert("No se pudo conectar con el servidor.");
      });
  }
}); // <-- Este cierre de llave final es el que asegura todo el DOMContentLoaded del archivo

// Funciones visibles pero no conectadas a proveedores externos: se informa al usuario en vez de dejar botones muertos.
document.addEventListener("click", (event) => {
  const oauth = event.target.closest("[data-oauth-placeholder]");
  if (oauth) {
    event.preventDefault();
    alert(`Inicio con ${oauth.dataset.oauthPlaceholder} está preparado como mejora opcional, pero requiere configurar OAuth y credenciales del proveedor.`);
    return;
  }
  const forgot = event.target.closest("[data-forgot-password]");
  if (forgot) {
    event.preventDefault();
    alert("La recuperación automática por correo todavía no está habilitada. Para el proyecto final, contacta al administrador de la tienda para restablecer el acceso.");
  }
});

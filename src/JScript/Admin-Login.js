document.addEventListener("DOMContentLoaded", () => {
  // 1. CAPTURAMOS LOS ELEMENTOS DEL HTML CON LOS IDs CORRECTOS
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("exampleInputEmail1");
  const passwordInput = document.getElementById("clave-usuario");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const btnToggleClave1 = document.getElementById("toggle-clave-1");

  // 2. FUNCIONALIDAD: MOSTRAR / OCULTAR CONTRASEÑA (Totalmente fuera del formulario)
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

  // 3. ACTIVAMOS EL ESCUCHADOR DEL OJITO
  if (btnToggleClave1) {
    btnToggleClave1.addEventListener("click", () => {
      alternarVisibilidadClave(passwordInput, btnToggleClave1);
    });
  }

  // 4. LÓGICA DEL FORMULARIO Y VALIDACIONES
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Evita que se recargue la página

      const emailValue = emailInput.value.trim();
      const passwordValue = passwordInput.value.trim();

      // Condición: Si AMBOS campos están vacíos al hacer clic
      if (emailValue === "" && passwordValue === "") {
        alert(
          "Por favor completa los campos del formulario. No has ingresado ninguna información.",
        );
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

      // --- Validar Correo Electrónico ---
      if (emailValue === "") {
        showError(
          emailInput,
          emailError,
          "El correo electrónico es obligatorio.",
        );
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        showError(
          emailInput,
          emailError,
          "Ingresa un correo electrónico con formato válido.",
        );
        isValid = false;
      } else {
        showSuccess(emailInput, emailError);
      }

      // --- Validar Contraseña ---
      if (passwordValue === "") {
        showError(
          passwordInput,
          passwordError,
          "La contraseña es obligatoria.",
        );
        isValid = false;
      } else if (passwordValue.length < 6) {
        showError(
          passwordInput,
          passwordError,
          "La contraseña debe tener al menos 6 caracteres.",
        );
        isValid = false;
      } else {
        showSuccess(passwordInput, passwordError);
      }

      // --- Si todo es válido (CONEXIÓN AL BACKEND) ---
      if (isValid) {
        // NUEVO: Petición fetch hacia el endpoint de administradores en Spring Boot
        fetch(window.YeyaApi.url("/api/admin/login"), {
          // Ajusta esta URL según tu Controller de Java
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Le avisa al servidor que mandamos un JSON
          },
          body: JSON.stringify({
            correo: emailValue,
            clave: passwordValue,
          }),
        })
          .then(async (response) => {
            if (response.ok) {
              const usuario = await response.json();
              sessionStorage.setItem("usuarioActual", JSON.stringify(usuario));
              alert("¡Inicio de sesión como Administrador exitoso!");
              window.location.href = "9_A-Panel-Estadistica.html";
            } else if (response.status === 401) {
              alert("Correo o contraseña de administrador incorrectos.");
            } else if (response.status === 403) {
              alert("Este usuario no tiene permisos de administrador.");
            } else {
              alert("No fue posible iniciar sesión como administrador.");
            }
          })
          .catch((error) => {
            console.error("Error crítico de conexión con el backend:", error);
            alert(
              "No se pudo conectar con el servidor. Verifica que tu IntelliJ esté encendido.",
            );
          });
      }
    });
  }

  // Limpiar/Validar dinámicamente mientras el usuario escribe
  emailInput.addEventListener("input", () => {
    if (emailInput.classList.contains("is-invalid")) {
      clearStatus(emailInput, emailError);
    }
  });

  passwordInput.addEventListener("input", () => {
    if (passwordInput.classList.contains("is-invalid")) {
      clearStatus(passwordInput, passwordError);
    }
  });

  // --- Funciones Auxiliares para clases de Bootstrap ---
  function showError(input, errorElement, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  function showSuccess(input, errorElement) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }

  function clearStatus(input, errorElement) {
    input.classList.remove("is-invalid", "is-valid");
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
});

document.addEventListener('click',e=>{
  const forgot=e.target.closest('[data-forgot-password]');
  if(forgot){e.preventDefault();alert('La recuperación automática por correo no está habilitada en este proyecto. Usa una cuenta administrativa válida o solicita a otro administrador que gestione tu acceso.');}
});

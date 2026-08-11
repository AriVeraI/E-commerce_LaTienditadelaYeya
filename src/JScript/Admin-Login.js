document.addEventListener('DOMContentLoaded', () => {
  // 1. CAPTURAMOS LOS ELEMENTOS DEL HTML CON LOS IDs CORRECTOS
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('exampleInputEmail1');
  const passwordInput = document.getElementById('clave-usuario');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const btnToggleClave1 = document.getElementById('toggle-clave-1');

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
  btnToggleClave1.addEventListener("click", () => {
    alternarVisibilidadClave(passwordInput, btnToggleClave1);
  });

  // 4. LÓGICA DEL FORMULARIO Y VALIDACIONES
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que se recargue la página

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // Condición: Si AMBOS campos están vacíos al hacer clic
    if (emailValue === '' && passwordValue === '') {
      alert('Por favor completa los campos del formulario. No has ingresado ninguna información.');
      showError(emailInput, emailError, 'El correo electrónico es obligatorio.');
      showError(passwordInput, passwordError, 'La contraseña es obligatoria.');
      return; // Detenemos la ejecución aquí
    }

    let isValid = true;

    // --- Validar Correo Electrónico ---
    if (emailValue === '') {
      showError(emailInput, emailError, 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      showError(emailInput, emailError, 'Ingresa un correo electrónico con formato válido.');
      isValid = false;
    } else {
      showSuccess(emailInput, emailError);
    }

    // --- Validar Contraseña ---
    if (passwordValue === '') {
      showError(passwordInput, passwordError, 'La contraseña es obligatoria.');
      isValid = false;
    } else if (passwordValue.length < 6) {
      showError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    } else {
      showSuccess(passwordInput, passwordError);
    }

    // --- Si todo es válido ---
    if (isValid) {
      console.log('Datos listos para enviar:', {
        email: emailValue,
        password: passwordValue
      });
      alert('¡Inicio de sesión exitoso!');
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

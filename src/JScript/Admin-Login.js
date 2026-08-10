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

    // --- NUEVA VALIDACIÓN: Consultar datos dinámicos ---
    // Busca las credenciales del usuario guardado dinámicamente en el navegador
    const storedUser = JSON.parse(localStorage.getItem('registeredUser')) || {
      email: "ana@ejemplo.com", // Valor por defecto si no hay nada guardado
      password: "123456password"
    };

    if (isValid && (emailValue !== storedUser.email || passwordValue !== storedUser.password)) {
      Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'El usuario o la contraseña son incorrectos. Por favor verifica tus datos.',
          confirmButtonColor: '#c05c6d',
            confirmButtonText: 'Aceptar'
          });
      showError(emailInput, emailError, 'Correo o contraseña incorrectos.');
      showError(passwordError, passwordError, 'Correo o contraseña incorrectos.');
      isValid = false;
    }

    // --- 3. Si todo es válido ---
    if (isValid) {
      console.log('Datos listos para enviar:', {
        email: emailValue,
        password: passwordValue
      });
      Swal.fire({
          icon: 'success',
          title: 'Accesso Correcto',
          text: 'Inicio de sesión exitoso.',
          confirmButtonColor: '#c05c6d',
            confirmButtonText: 'Aceptar'
});
      
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
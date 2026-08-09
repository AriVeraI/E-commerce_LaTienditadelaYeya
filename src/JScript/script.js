document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const phoneInput = document.getElementById('contactNumber');
  const emailInput = document.getElementById('contactEmail');

  // 1. LIMPIA EL FORMULARIO AL CARGAR POR PRIMERA VEZ
  if (contactForm) {
    contactForm.reset();
  }

  // 2. LIMPIA EL FORMULARIO CUANDO EL USUARIO REGRESA DESDE FORMSPREE
  // (El evento 'pageshow' se dispara al volver atrás en el navegador)
  window.addEventListener('pageshow', () => {
    if (contactForm) {
      contactForm.reset();
    }
  });

  // 3. RESTRICCIÓN EN TIEMPO REAL PARA EL TELÉFONO (Solo números, máximo 10)
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
      
      // Quita el mensaje personalizado de error mientras escribe
      phoneInput.setCustomValidity('');
    });
  }

  // 4. LIMPIA LA VALIDACIÓN DEL CORREO MIENTRAS EL USUARIO ESCRIBE
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.setCustomValidity('');
    });
  }

  // 5. VALIDACIÓN PERSONALIZADA AL ENVIAR
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const emailValue = emailInput ? emailInput.value.trim() : '';
      const phoneValue = phoneInput ? phoneInput.value.trim() : '';
      const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      // Reiniciar mensajes de error
      if (emailInput) emailInput.setCustomValidity('');
      if (phoneInput) phoneInput.setCustomValidity('');

      // Validación de Email
      if (emailInput && !regexEmail.test(emailValue)) {
        if (!emailValue.includes('@')) {
          emailInput.setCustomValidity(`Incluye un signo "@" en la dirección de correo electrónico. La dirección "${emailValue}" no incluye el signo "@".`);
        } else {
          emailInput.setCustomValidity('Por favor, ingresa un correo electrónico válido.');
        }
        emailInput.reportValidity();
        e.preventDefault();
        return;
      }

      // Validación de Teléfono (Exige exactamente 10 dígitos)
      if (phoneInput && phoneValue.length !== 10) {
        phoneInput.setCustomValidity('Por favor, ingresa un número de teléfono de exactamente 10 dígitos.');
        phoneInput.reportValidity();
        e.preventDefault();
        return;
      }
    });
  }
});
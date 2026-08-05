//  FUNCIONAMIENTO ODE LA BARRA DE NAVEGACIÓN DEL PANEL, PARA QUE EL MENÚ RESALTE LA PARTE EN DONDE SE ENCUENTRA EL ADMIN ACTUALMENTE

//Inicio de funcionalidad
//NOTA: Falta cubrir el detalle de que cuando cambia a otra opción, hace algo raro en la animación, se alcanza a ver 
//el campo cuadrado y despues se redondea, es muy perceptible - Iran
const menuLinks = document.querySelectorAll('.menu-link');

  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 1. Restablecemos todos los enlaces a su estado normal (texto oscuro, sin fondo)
      menuLinks.forEach(item => {
        item.classList.remove('text-white', 'rounded-pill', 'px-3', 'active-custom');
        item.classList.add('text-dark');
        item.style.backgroundColor = '';
      });

      // 2. Aplicamos el estilo activo (fondo rosa y texto blanco) al enlace seleccionado
      this.classList.remove('text-dark');
      this.classList.add('text-white', 'rounded-pill', 'px-3', 'active-custom');
      this.style.backgroundColor = '#C66271';
    });
  });

  //Fin de la fucionalidad
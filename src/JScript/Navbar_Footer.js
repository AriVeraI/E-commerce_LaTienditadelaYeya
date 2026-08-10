


// Usamos fetch para buscar el archivo HTML del navbar
fetch('../Components/navbar1.html')
    .then(response => response.text())
    .then(data => {
        const nav1 = document.getElementById('navbar1');
        if (nav1) { // Solo inyecta si existe el elemento en la página
            nav1.innerHTML = data;
        }
    })
    .catch(error => console.error('Error al cargar navbar1:', error));





fetch('../../Components/navbar1.html')
    .then(response => response.text()) // Convertimos la respuesta a texto plano
    .then(data => {
        // Seleccionamos el div del index y le asignamos el HTML obtenido
        document.getElementById('navbar1').innerHTML = data;
        console.log("Si se cargo chido")
    })
    .catch(error => console.error('Hubo un error al cargar el navbar:', error));

// Usamos fetch para buscar el archivo HTML del navbar
fetch('../Components/navbar2.html')
    .then(response => response.text()) // Convertimos la respuesta a texto plano
    .then(data => {
        // Seleccionamos el div del index y le asignamos el HTML obtenido
        document.getElementById('navbar2').innerHTML = data;
        console.log("Si se cargo chido")
    })
    .catch(error => console.error('Hubo un error al cargar el navbar:', error));


// Usamos fetch para buscar el archivo HTML del footer
fetch('../Components/footer.html')
    .then(response => response.text()) // Convertimos la respuesta a texto plano
    .then(data => {
        // Seleccionamos el div del index y le asignamos el HTML obtenido
        document.getElementById('footer1').innerHTML = data;
        console.log("Si se cargo chido")
    })
    .catch(error => console.error('Hubo un error al cargar el footer:', error));
// Usamos fetch para buscar el archivo HTML del navbar
fetch('../Components/navbar1.html')
    .then(response => response.text()) // Convertimos la respuesta a texto plano
    .then(data => {
        // Seleccionamos el div del index y le asignamos el HTML obtenido
        document.getElementById('navbar1').innerHTML = data;
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
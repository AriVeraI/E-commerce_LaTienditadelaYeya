// Función para mandar a llamar la navbar 1 que es para las páginas de cliente, primero se usa
// un if para saber que el elemento se encuentra en la página y luego un fetch para buscar el
// archivo HTML con el navbar, luego convertimos la respuesta a texto y seleccionamos el 
// espacio donde se va a colocar el contenido del nav bar, se hace una prueba en consola
// para ver que cargo bien y sino imprime el error en consola, si el elemento no existe en
// el HTML donde se desea introducir no lleva a cabo la función.
const navbar1 = document.getElementById('navbar1');
if (navbar1){
    fetch('../Components/navbar1.html')
        .then(response => response.text()) 
        .then(data => {
            navbar1.innerHTML = data;
            console.log("Si se cargo chido")
        })
        .catch(error => console.error('Hubo un error al cargar el navbar1:', error));
}

const navbar2= document.getElementById('navbar2');
if(navbar2) {
    fetch('../Components/navbar2.html')
        .then(response => response.text()) 
        .then(data => {
            navbar2.innerHTML = data;
            console.log("Si se cargo chido")
        })
        .catch(error => console.error('Hubo un error al cargar el navbar2:', error));
}

const footer1 = document.getElementById('footer1');
if (footer1) {
    fetch('../Components/footer.html')
        .then(response => response.text()) 
        .then(data => {
            footer1.innerHTML = data;
            console.log("Si se cargo chido")
        })
        .catch(error => console.error('Hubo un error al cargar el footer:', error));
}
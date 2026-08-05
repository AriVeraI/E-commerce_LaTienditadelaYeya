//se requiere revisar el formulario html para verificar que las alertas funcionen correctamente//

//funcion para captura de datos del formulario
const mainForm = () => {
    const nameProduct = document.getElementById('titulo-producto');
    const category = document.getElementById('categoria-producto');
    const price = document-getElementById('precio-producto');
    const description = document.getElementById('precio-producto');

    validation(nameProduct, category, price, description);
}

//funcion para validacion de datos
const validation = (nameProduct, category, price, description) => {
    if(nameProduct.value === '' || category.value == '' || description.value == '' || category == ''){
        alertTexts();
    }

    if(isNaN(price.value) || price.value === ''){
        alertPrices(price);
    } else {
        alertCero(price);
    }
}

//funcion para alerta de inputs de texto obligatorios
const alertTexts = () => {
    const modalText = document.querySelector('.modal-text');
    const modal = new bootstrap.Modal(modalText);

    modal.show();
}

//funcion para alerta de precios
const alertPrices = (price) => {
    const modalPrice = document.querySelector('.modal-price');
    const modalCero = document.querySelector('.modal-cero')
    const modal;

    if(price < 0){
        modal = new bootstrap.Modal(modalCero);
        modal.show();

    }else{
        modal = new bootstrap.Modal(modalPrice);
        modal.show();
    }
}

document.getElementById('mainForm').addEventListener('submit', (e) => {
    e.preventDefault();
    mainForm();

});
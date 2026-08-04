
class ItemsController {
    constructor(currentId = 1) {
        this.productos = [];
        this.currentId = currentId;
    }

    // Create the addItem method
    addItem(nombre, descripcion,imgRef) {
        
        const producto = {    
            id: this.currentId++,
            nombre: nombre,
            descripcion: descripcion,
            imgRef: imgRef
        };

        this.productos.push(producto); 
    }
}


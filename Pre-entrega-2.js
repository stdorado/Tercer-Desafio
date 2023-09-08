const fs = require('fs');

class Product {
    constructor(nombre, precio, thumbnail, descripcion, code, stock) {
        this.id = null; 
        this.nombre = nombre;
        this.precio = precio;
        this.thumbnail = thumbnail;
        this.descripcion = descripcion;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor(path) {
        this.path = "./productos.js"; //establesco la ruta de donde se guarda los datos
        this.productos = [];
        this.nextId = 1;

        // si existe
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.productos = JSON.parse(data);
            if (this.productos.length > 0) {
                const maxId = Math.max(...this.productos.map(prod => prod.id));
                this.nextId = maxId + 1;
            }
        } catch (error) {
            // Si hay error se sigue con next1
        }
    }

    _guardarProductosEnArchivo() {
        try {
            const data = JSON.stringify(this.productos, null, 2);
            fs.writeFileSync(this.path, data);
        } catch (error) {
            console.error('Error al guardar los productos en el archivo:', error);
        }
    }

    agregarProducto(producto) {
        const codigoExistente = this.productos.some(prod => prod.code === producto.code);
        if (codigoExistente) {
            console.log(`Error: El código "${producto.code}" ya está en uso.`);
            return;
        }
        
        producto.id = this.nextId;
        this.nextId++;

        this.productos.push(producto);

        // Guardaaa el prodducto
        this._guardarProductosEnArchivo();
    }

    getProducts() {
        return this.productos;
    }

    getProductById(id) {
        const productoEncontrado = this.productos.find(prod => prod.id === id);
        if (productoEncontrado) {
            return productoEncontrado;
        } else {
            return "El producto no existe.";
        }
    }

    updateProduct(id, updatedFields) {
        const productoIndex = this.productos.findIndex(prod => prod.id === id);

        if (productoIndex === -1) {
            console.log(`Error: No se encontró un producto con el ID ${id}.`);
            return;
        }

        const productoExistente = this.productos[productoIndex];

        for (const field in updatedFields) {
            if (field in productoExistente) {
                productoExistente[field] = updatedFields[field];
            } else {
                console.log(`Error: El campo "${field}" no es válido.`);
            }
        }

        // actualizo el producto en la listaq
        this.productos[productoIndex] = productoExistente;
        this._guardarProductosEnArchivo();

        console.log(`Producto con ID ${id} actualizado.`);
    }

    deleteProduct(id) {
        const productoIndex = this.productos.findIndex(prod => prod.id === id);

        if (productoIndex === -1) {
            console.log(`Error: No se encontró un producto con el ID ${id}.`);
            return;
        }

        // elimino el productos de la lista
        this.productos.splice(productoIndex, 1);
        this._guardarProductosEnArchivo();

        console.log(`Producto con ID ${id} eliminado.`);
    }
}


const Manager = new ProductManager('./productos.json');

const Productos1 = new Product("iphone 10 pro", 100, "imagen iphone 12", "telefono de última generación", "||||| |||| ||||", 50);
const Productos2 = new Product("iphone 8 pro", 400, "imagen iphone 8", "telefono de última generación", "||||| |||||| ||||", 20);
const Productos3 = new Product("iphone 14 pro", 400, "imagen iphone 14", "telefono de última generación", "||||| |||||||| ||||", 40);

Manager.agregarProducto(Productos1);
Manager.agregarProducto(Productos2);
Manager.agregarProducto(Productos3);

console.log(Manager.getProducts());
console.log(Manager.getProductById(1)); 
console.log(Manager.getProductById(3)); 

const updatedFields = { precio: 120, stock: 25 };
Manager.updateProduct(1, updatedFields); //actualiza el prodcto
console.log(Manager.getProducts());

Manager.deleteProduct(2); // elimina el producto 2
console.log(Manager.getProducts()); 

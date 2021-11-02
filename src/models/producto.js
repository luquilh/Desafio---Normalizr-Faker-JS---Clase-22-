import mongoose from 'mongoose';
const productosCollection = 'productos';

const ProductoEsquema = mongoose.Schema({
    nombre: {type: String, required: true, minLength: 1, maxLenghth: 30},
    precio: {type: Number, required: true},
    foto: {type: String, required: false},
    id: {type: Number, required: true},
    timestamp: {type: Date, required: true, unique: true},
    descripcion: {type: String, required: false},
    codigo: {type: String, required: true},
    stock: {type: Number, required: true}
});

const Producto = mongoose.model(productosCollection, ProductoEsquema);
export {Producto, ProductoEsquema}





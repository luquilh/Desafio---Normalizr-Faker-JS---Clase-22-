import mongoose from 'mongoose';
const carritosCollection = 'carritos';

const CarritoEsquema = mongoose.Schema({
    productos: {type: Array, required: true},
    id: {type: Number, required: true},
    timestamp: {type: Date, required: true, unique: true}

});

const Carrito = mongoose.model(carritosCollection, CarritoEsquema);
export {Carrito, CarritoEsquema}



import mongoose from 'mongoose';
const mensajesCollection = 'mensajes';

const MensajeEsquema = mongoose.Schema({
    author: {
        id: {type: String, required: true},
        nombre: {type: String, required: true},
        apellido: {type: String, required: true},
        edad: {type: String, required: true},
        alias: {type: String, required: true},
        avatar: {type: String, required: true}
    },
    fechaHora: {type: String, required: true, unique: true},
    text: {type: String, required: true},
    timestamp: {type: Date, required: true, unique: true}

});

const Mensaje = mongoose.model(mensajesCollection, MensajeEsquema);
export {Mensaje, MensajeEsquema}



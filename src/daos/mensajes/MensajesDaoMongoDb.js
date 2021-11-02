import ContenedorMongoDB from '../../contenedores/ContenedorMongoDB.js'


import { MensajeEsquema } from '../../models/mensaje.js';

class MensajesDaoMongoDb extends ContenedorMongoDB{

    constructor(){
        super('mensajes', MensajeEsquema)
        delete this.id;
}
    async desconectar(){
        await mongoose.connection.close();
    }
}


export default MensajesDaoMongoDb
import ContenedorMongoDB from '../../contenedores/ContenedorMongoDB.js'


import { ProductoEsquema } from '../../models/producto.js';

class ProductosDaoMongoDb extends ContenedorMongoDB{

    constructor(){
        super('productos', ProductoEsquema)
}
    async desconectar(){
        await mongoose.connection.close();
    }
}


export default ProductosDaoMongoDb
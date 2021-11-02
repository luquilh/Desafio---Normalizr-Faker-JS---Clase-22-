import ContenedorMemoria from '../../contenedores/ContenedorMemoria.js'

class ProductosDaoMemoria extends ContenedorMemoria{

    constructor(){
        super()
        
    }

    async desconectar(){
        await mongoose.connection.close();
    }
}


export default ProductosDaoMemoria
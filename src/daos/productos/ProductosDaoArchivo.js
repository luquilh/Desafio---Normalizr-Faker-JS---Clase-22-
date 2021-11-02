import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js'
import config from '../../utils/config.js';



class ProductosDaoArchivo extends ContenedorArchivo{

    constructor(){
        super(config.archivo.productosFilePath)
        
    }

    async desconectar(){
        await mongoose.connection.close();
    }
}


export default ProductosDaoArchivo
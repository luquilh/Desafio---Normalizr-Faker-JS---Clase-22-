import config from '../../utils/config.js'

let productosDao

//process.env.PERS
//const db= 'firebase';
const db = process.env.DBPROD || 'memoria'


switch (db) {
    case 'archivo':
        const { default: ProductosDaoArchivo } = await import('./ProductosDaoArchivo.js')
        productosDao = new ProductosDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./ProductosDaoFirebase.js')
        productosDao = new ProductosDaoFirebase()
        
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./ProductosDaoMongoDb.js')
        productosDao = new ProductosDaoMongoDb()
        break
    default:
        const { default: ProductosDaoMem } = await import('./ProductosDaoMemoria.js')
        productosDao = new ProductosDaoMem()
        break
}

export { productosDao }
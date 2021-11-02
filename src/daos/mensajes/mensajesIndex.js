import config from '../../utils/config.js'

let mensajesDao

//process.env.PERS
const db= 'mongodb';
//const db = process.env.DBPROD || 'memoria'


switch (db) {
    case 'archivo':
        const { default: MensajesDaoArchivo } = await import('./MensajesDaoArchivo.js')
        mensajesDao = new MensajesDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: MensajesDaoFirebase } = await import('./MensajesDaoFirebase.js')
        mensajesDao = new MensajesDaoFirebase()
        
        break
    case 'mongodb':
        const { default: MensajesDaoMongoDb } = await import('./MensajesDaoMongoDb.js')
        mensajesDao = new MensajesDaoMongoDb()
        break
    default:
        const { default: MensajesDaoMem } = await import('./MensajesDaoMemoria.js')
        mensajesDao = new MensajesDaoMem()
        break
}

export { mensajesDao }
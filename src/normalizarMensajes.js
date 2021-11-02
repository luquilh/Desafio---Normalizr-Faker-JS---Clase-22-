
import {normalize, schema} from 'normalizr'
// Define a users schema



const authorSchema = new schema.Entity('authors');
const chatSchema = new schema.Entity('chat', {
  author: authorSchema
});



//-------------------------------------------

import util from 'util'

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true))
}



function normalizarMensajes(mensajes){
    const _mensajes = {
        id: 'mensajes',
        mensajes: mensajes
    }
    
    const mensajesNormalizados= normalize(_mensajes, chatSchema);
    
    
    return mensajesNormalizados;
    
}



/* ---------------------------------------------------------------------------------------- */


export {normalizarMensajes, print};
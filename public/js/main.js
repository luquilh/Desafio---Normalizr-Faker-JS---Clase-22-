const socket = io();

const authorSchema = new normalizr.schema.Entity('authors');
const chatSchema = new normalizr.schema.Entity('chat', {
  author: authorSchema,
});



const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    e.preventDefault()

    // armo producto extrayendo los datos de los campos del formulario
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    
    // envio el producto al servidor via socket
    
    socket.emit('update', producto);

    // limpio el contenido de los campos del formulario
    formAgregarProducto.reset()
})

// agrego manejador de eventos de tipo 'productos'
socket.on('productos', manejarEventoProductos);

async function manejarEventoProductos(productos) {
      
    // busco la plantilla del servidor
    const recursoRemoto = await fetch('plantillas/tabla-productos.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con los productos recibidos
    const html = functionTemplate({ productos })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('productos').innerHTML = html
}


// Agrego manejador de eventos de tipo mensajes
socket.on('mensajes', manejarEventoMensajes);

async function manejarEventoMensajes(mensajes){

    const denormalizedMensajes = normalizr.denormalize(mensajes.result, chatSchema, mensajes.entities);
    
    const recursoRemoto = await fetch('plantillas/chat.hbs')
    const recursoRemoto2 = await fetch('plantillas/compresionMensajes.hbs')
    const textoPlantilla = await recursoRemoto.text()
    const textoPlantilla2 = await recursoRemoto2.text()
    const _mensajes = denormalizedMensajes.mensajes;
    
    const functionTemplate = Handlebars.compile(textoPlantilla)
    const functionTemplate2 = Handlebars.compile(textoPlantilla2)
    const html = functionTemplate({ _mensajes })
    
    document.getElementById('mensajes').innerHTML = html
    const caracteresNormalizados= JSON.stringify(mensajes).length;
    const caracteresDesnormalizados= JSON.stringify(denormalizedMensajes).length;
    const compresion = ((1 - caracteresNormalizados / caracteresDesnormalizados) * 100).toFixed(2);
    const html2 = functionTemplate2({ compresion })
    document.getElementById('compresion').innerHTML = html2
    console.log('NORMALIZADOS 1 : ', caracteresNormalizados)
    console.log('DESNORMALIZADOS 2 : ', caracteresDesnormalizados)
    //console.log('compresion 3 : ', compresion)
 }


const formEnviarMensaje = document.getElementById('formEnviarMensaje')
formEnviarMensaje.addEventListener('submit', e => {
    e.preventDefault()
/*    const mensaje = {
        email: document.getElementById('email').value,
        //fechaHora: Date.now().toLocaleString('ko-KR', { timeZone: 'UTC' }),
        fechaHora: moment().format('DD/MM/YYYY HH:mm:ss'),
        mensaje: formEnviarMensaje[0].value
    }
*/
    const mensaje = {

        author: {
            id: document.getElementById('email').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },

        //fechaHora: Date.now().toLocaleString('ko-KR', { timeZone: 'UTC' }),
        fechaHora: moment().format('DD/MM/YYYY HH:mm:ss'),
        
        text: formEnviarMensaje[0].value
    }
    
    socket.emit('nuevo-mensaje', mensaje);
    formEnviarMensaje.reset()
})

const botonLogout = document.getElementById('desloguear')
botonLogout.addEventListener('click', desloguearUsuario);

async function desloguearUsuario(e){
   
    e.preventDefault()
    await fetch('/logout', {
        method: 'GET',
        //mode: 'cors'
      })
 
      console.log('ANTES DE REPLACE')
    //location.replace('/logout')
    
  
    console.log('DESPUES DE REPLACE')
    setTimeout(()=> console.log('LUCAS SETTIMEOUT'),20000)
    
        //console.log('Lucas 2 segundos despues')

    
}
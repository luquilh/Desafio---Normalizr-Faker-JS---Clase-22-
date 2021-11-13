

import express from 'express'
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import faker from 'faker'
import session from 'express-session'
import handlebars from 'express-handlebars'



import { mensajesDao } from './daos/mensajes/mensajesIndex.js';
import {normalizarMensajes, print} from './normalizarMensajes.js';





const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "logout.hbs",
        layoutsDir: "./public/plantillas",
        //partialsDir: __dirname + "/views/partials"
    })
);

app.set('views', './public/plantillas'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas

import Contenedor from './contenedores/ContenedorDB.js'
import {options as optionsSQLite3} from './options/SQLite3.js'
import { options as optionsMariaDB } from './options/mariaDB.js'

const tablaMensajes = 'mensajes';
const tablaProductos = 'productos';

//const chatCont = new Contenedor(optionsSQLite3, tablaMensajes);
const productosCont = new Contenedor(optionsMariaDB, tablaProductos)
//const chatCont = mensajesDao;
//const productosCont = new Contenedor('./productos.txt');
//const chatCont = new Contenedor('./historialChat.txt');


let productos = [];
const catalogo = await productosCont.getAll()
productos = catalogo.slice();

let mensajes=[];
const historial = await mensajesDao.getAll();
mensajes = historial.slice();

//--------------------------------------------
// Ruta /api/productos-test con Faker.js

app.get('/api/productos-test', (req, res) => {
    let lista= [];
    for (let i=0; i<= 4; i++){
        lista.push({
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.imageUrl()
        })
    }
    
    res.json(lista)
    
})


app.use(session({
    secret: 'qwerty',
    cookie: { maxAge: 10000 },
    rolling: true
  }))
  

  const auth = (req, res, next) => {
    //console.log('esta conectado LUCAS ?', req.session)
    if (req.session.usuario) {
      return next()
    }
    return res.redirect('/login')
}
app.get('/', auth)




//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', productos);
    // carga inicial de mensaje

    
    socket.emit('mensajes', normalizarMensajes(mensajes));
    //console.log(JSON.stringify({id: 'mensajes', mensajes: mensajes}).length)
    //print({id: 'mensajes', mensajes: mensajes})
    //console.log(JSON.stringify(normalizarMensajes(mensajes)).length)
    //socket.emit('mensajes', mensajes);
    // actualizacion de productos
    //print(normalizarMensajes(mensajes))
    
    socket.on('update', producto => {
        
        productosCont.save(producto);
        productos.push(producto)
        io.sockets.emit('productos', productos);
    })

    //actualizacion de mensajes
    socket.on('nuevo-mensaje', data => {
        
        mensajesDao.save(data);
        mensajes.push(data);
        
        io.sockets.emit('mensajes', normalizarMensajes(mensajes));
        //io.sockets.emit('mensajes', mensajes);
        
    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))



//--------------------------------------------
// Rutas de login


app.get('/login', (req, res) => {
    res.sendFile('/home/lucas/Desktop/Curso_Programacion_Backend/Desafios/Clase_24-Cookies_y_Sessions/public/login.html')

})

app.post('/api/login/usuario', (req,res) => {
    req.session.usuario= req.body.usuario
    //console.log('ACA FUNCIONA' , req.session.usuario)
    console.log('ACA FETCH LUCAS')
    res.redirect('/')
})


  

/*
app.post('/api/logout', function(req, res, next) {
    

    
    return req.session.destroy(err => {
        if (!err) {
            
          return res.redirect('/logout');
        }
        return res.send({ error: err })
       })
    
    

})
*/
app.get('/logout', (req,res) => {

    let usuario = req.session.usuario;
  /*  return req.session.destroy(err => {
        if (!err) {
            console.log('FUNCIONO?', usuario) 
            //return res.render('logout.hbs', { usuario} ); 
          return res.sendFile('/home/lucas/Desktop/Curso_Programacion_Backend/Desafios/Clase_24-Cookies_y_Sessions/public/logout.html')
        }
        console.log('LUCAS ERROR')
        return res.send({ error: err })
        
       })
    */
    req.session.destroy()
    res.sendFile('/home/lucas/Desktop/Curso_Programacion_Backend/Desafios/Clase_24-Cookies_y_Sessions/public/logout.html')
    //res.sendFile('/home/lucas/Desktop/Curso_Programacion_Backend/Desafios/Clase_24-Cookies_y_Sessions/public/logout.html')
    //res.sendFile('/home/lucas/Desktop/Curso_Programacion_Backend/Desafios/Clase_24-Cookies_y_Sessions/public/login.html')  
})
     
    //req.session.destroy();
    
    //var pagina='<!doctype html><html><head></head><body>'+
    //         '<br><a href="/">Retornar</a></body></html>';
    //res.send(pagina);


// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

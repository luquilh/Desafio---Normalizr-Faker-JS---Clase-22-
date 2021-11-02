

import express from 'express'
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import faker from 'faker'

import { mensajesDao } from './daos/mensajes/mensajesIndex.js';
import {normalizarMensajes, print} from './normalizarMensajes.js';


const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

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
//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', productos);
    // carga inicial de mensaje

    
    socket.emit('mensajes', normalizarMensajes(mensajes));
    //console.log(JSON.stringify({id: 'mensajes', mensajes: mensajes}).length)
    print({id: 'mensajes', mensajes: mensajes})
    //console.log(JSON.stringify(normalizarMensajes(mensajes)).length)
    //socket.emit('mensajes', mensajes);
    // actualizacion de productos
    print(normalizarMensajes(mensajes))
    
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
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

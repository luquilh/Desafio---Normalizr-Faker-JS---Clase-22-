import Contenedor from './contenedores/ContenedorDB.js'
import { options as optionsSQLite3 } from  './options/SQLite3.js'
import { options as optionsMariaDB } from  './options/mariaDB.js'

//const Contenedor = require(__dirname + '/contenedores/ContenedorDB.js')
//const { options } = require(__dirname + '/options/SQLite3.js')


const tablaMensajes = 'mensajes';
const tablaProductos = 'productos';
const sqlMensajes = new Contenedor(optionsSQLite3, tablaMensajes)
const sqlProductos = new Contenedor(optionsMariaDB, tablaProductos)

async function crearTablaMensajes() {
  return await sqlMensajes.knex.schema.dropTableIfExists(sqlMensajes.tabla)
    .finally(() => {
      return sqlMensajes.knex.schema.createTable(sqlMensajes.tabla, table => {
        table.increments('id').primary();
        table.string('email', 50).notNullable();
        table.string('mensaje', 100);
        table.string('fechaHora', 50).notNullable();
        
      })
    })
}


async function crearTablaProductos() {
  return await sqlProductos.knex.schema.dropTableIfExists(sqlProductos.tabla)
    .finally(() => {
      return sqlProductos.knex.schema.createTable(sqlProductos.tabla, table => {
        table.increments('id').primary();
        table.string('title', 50).notNullable();
        table.float('price');
        table.string('thumbnail', 100).notNullable();
        
      })
    })
}







try {
  
  await crearTablaMensajes();
  await crearTablaProductos();

  console.log(" Tablas creadas")

  

} catch (error) {
  console.log(error)
} finally {
  sqlMensajes.close()
  sqlProductos.close()
}

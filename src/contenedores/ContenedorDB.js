
import { options } from '../options/SQLite3.js'
//const knex = require('knex')(options)
import knexLib from 'knex'

class Contenedor{

    constructor(options, tabla){
        this.knex = knexLib(options)
        //this.knex = knex;
        this.tabla = tabla;
    }




    async save(articulos){
        
        try{
            await this.knex(this.tabla).insert(articulos)
        } catch (err) {
            throw new Error(`Error de escritura: ${err}`);
        }
        console.log(`Producto ${articulos.title} con id: ${articulos.id} agregado al catálogo`)
        //return articulos[articulos.length-1].id;
    }

    async getById(id){                                                  
        
        try{
            const producto = await this.knex(this.tabla).select('*').where({id: id})
            //const producto = contenidoJsonArray.find( (elem) => elem.id == id);
            return producto ? producto : null;
         } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`);
        }
    }
    

    async getAll(){
        try{
            
            const catalogo = await this.knex(this.tabla).select('*')
            return catalogo;
        } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`)
        }
    }
    
  
    

    async deleteById(id){
        try{
            await this.knex.from(this.tabla).where({id: id}).del()
            console.log(`Producto con id:${id} borrado`)
            } catch(err) {
                throw new Error(`Error al borrar elemento: ${err}`);
            }

        }
    

    async deleteAll(){
        
        try{
            await this.knex.from(this.tabla).del()
            console.log('Catálogo borrado')
            } catch(err) {
                throw new Error(`Error al borrar catalogo: ${err}`);
            }

        

    }

    async changeById(id, nuevo){
        
        const anterior = await this.getById(id);
    
        
        try{
            
            await this.knex.from(this.tabla).where({id: id}).update(nuevo)
            console.log(`Producto con id:${id} actualizado`)
            return anterior;
            
        } catch(err) {
            console.log(nuevo)
            throw new Error(`Error al reescribir elemento: ${err}`);
        }

        
    }


    close() {
        this.knex.destroy();
      }
    
}



export default Contenedor;
//module.exports= Contenedor;
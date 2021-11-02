
import mongoose from 'mongoose';
import config from '../utils/config.js';

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)


class ContenedorMongoDB{

    constructor(nombreColeccion, esquema){
        this.coleccion = mongoose.model(nombreColeccion, esquema);
        

        //this.connect()
        
    }

    async connect(){
        await mongoose.connect(this.uri, 
            { 
              useNewUrlParser: true,
              useUnifiedTopology: true,
              serverSelectionTimeoutMS: 1000
            })
    }

    async save(obj){
        let id;
        const contenidoJsonArray = await this.getAll();
        
        if(contenidoJsonArray.length>0){
            const ultimoId = contenidoJsonArray[contenidoJsonArray.length-1].id;
            
            obj.id = parseInt(ultimoId) + 1;
        } else {
            obj.id = 1;
        }
       
        obj.timestamp = Date.now();
        
        try{
            
            const productoSaveModel = new this.coleccion(obj);
                     productoSaveModel.save()

        } catch (err) {
            throw new Error(`Error de escritura: ${err}`);
        }
        console.log(`Elemento id: ${obj.id} agregado al catálogo`)
        return obj.id;
    }

    async getById(id){                                                  
        
        try{
            
            let producto = await this.coleccion.find({id: id},{_id: 0,__v: 0});
            
            return producto[0] ? producto[0] : null;
         } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`);
        }
    }
    

    async getAll(){
        try{
            let productos = await this.coleccion.find({},{__v: 0});
            

            return productos;
        } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`)
        }
    }
    
    
    

    async deleteById(id){
        
        const contenidoJsonArray = await this.getAll();
        if(contenidoJsonArray.length==0){
            return null;
        }
        
        if(contenidoJsonArray.some( elem => elem.id ==id )){

            const index = contenidoJsonArray.findIndex( elem => elem.id == id);
            contenidoJsonArray.splice(index,1);
            try{
                
              await this.coleccion.deleteOne({id: id});
              console.log(`Producto con id:${id} borrado`)
            } catch(err) {
                throw new Error(`Error al borrar elemento: ${err}`);
            }

        } else {
            throw new Error('ID ingresado no valido');
        }
    }

    async deleteAll(){
        try{
            await this.coleccion.deleteMany({});
            
            console.log('Catálogo borrado')
        } catch (err){
            throw new Error(`Error al borrar catálogo: ${err}`);
        }

    }

    async changeById(id, nuevo){
        
        const contenidoJsonArray = await this.getAll();
        
        if(contenidoJsonArray.some( elem => elem.id ==id )){
            nuevo.id= id;
            nuevo.timestamp= Date.now();
            let anterior;
            const index = contenidoJsonArray.findIndex( elem => elem.id == id);
            anterior =contenidoJsonArray[index];

            //contenidoJsonArray[index] = nuevo;
            try{
                
                await this.coleccion.updateOne({id: id},  nuevo);
                
                console.log(`Producto con id:${id} actualizado`)

                return anterior;
              
            } catch(err) {
                throw new Error(`Error al reescribir elemento: ${err}`);
            }

        } else {
            //throw new Error('ID ingresado no valido');
            return null;
        }
    }
    
}




export default ContenedorMongoDB;
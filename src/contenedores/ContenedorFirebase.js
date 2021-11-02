  
import fs from 'fs'
import admin from "firebase-admin"
import config from '../utils/config.js'


const serviceAccount = JSON.parse(fs.readFileSync(config.firebase.pathCnxCredentials))

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore();
console.log('Base Firebase conectada!')


class ContenedorFirebase{

    constructor(nombreColeccion){
        
        this.coleccion = db.collection(nombreColeccion);
        
        

    
        
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
            let doc = this.coleccion.doc(`${obj.id}`)
            await doc.create(obj)
           
         
        } catch (err) {
            throw new Error(`Error de escritura: ${err}`);
        }
        console.log(`Elemento id: ${obj.id} agregado al catálogo`)
        
        return id;
    }

    async getById(id){                                                  
        
        try{
            
            const producto = await this.coleccion.doc(id).get();
           
            const prod = {id: producto.id, ...producto.data()}
            
            return prod ? prod : null;
            
          
            
            
         } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`);
        }
    }
    

    async getAll(){
        try{
            //let productos = await Model.find({},{__v: 0});
            const ops = []
            const productos = await this.coleccion.get();
            productos.forEach(doc => {
                ops.push({ id: doc.id, ...doc.data() })
            })
            
            return ops;
               
 
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
                                
                await this.coleccion.doc(id).delete(); 
              
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
            const docs = await this.getAll()
            const ids = docs.map(d => d.id)
            const promesas = ids.map(id => this.deleteById(id))
            const resultados = await Promise.allSettled(promesas)
            const errores = resultados.filter(r => r.status == 'rejected')
            if (errores.length > 0) {
                throw new Error('no se borró todo. volver a intentarlo')
            }
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
                
                await this.coleccion.doc(id).update(nuevo);
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
export default ContenedorFirebase;
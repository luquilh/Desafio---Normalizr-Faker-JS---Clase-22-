import fs from 'fs';


class ContenedorArchivo{

    constructor(filename){
        this.filename = filename;
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
        contenidoJsonArray.push(obj);
        try{
            await fs.promises.writeFile(this.filename, JSON.stringify(contenidoJsonArray, null, 2));
        } catch (err) {
            throw new Error(`Error de escritura: ${err}`);
        }
        console.log(`Elemento id: ${obj.id} agregado al catálogo`)
        return obj.id;
    }

    async getById(id){                                                  
        
        try{
            const contenidoJsonArray = await this.getAll();
            const producto = contenidoJsonArray.find( (elem) => elem.id == id);
            
            return producto ? producto : null;
         } catch(err){
            throw new Error(`Error al leer el archivo: ${err}`);
        }
    }
    

    async getAll(){
        try{
            const contenidoStr = await fs.promises.readFile(this.filename, 'utf-8');
            const contenidoJsonArray = JSON.parse(contenidoStr);
            return contenidoJsonArray;
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
                
              await fs.promises.writeFile(this.filename, JSON.stringify(contenidoJsonArray, null, 2));
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
            await fs.promises.writeFile(this.filename, '[]');
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

            contenidoJsonArray[index] = nuevo;
            try{
            
                await fs.promises.writeFile(this.filename, JSON.stringify(contenidoJsonArray, null, 2));
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


//module.exports= Contenedor;
export default ContenedorArchivo;
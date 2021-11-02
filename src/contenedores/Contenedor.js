import fs from 'fs'

class Contenedor{

    constructor(filename){
        this.filename = filename;
    }

    async save(obj){
        let id;
        const contenidoJsonArray = await this.getAll();
        const ultimoId = contenidoJsonArray[contenidoJsonArray.length-1].id;
        obj.id = contenidoJsonArray.length > 0 ? ultimoId + 1 : 1;
        contenidoJsonArray.push(obj);
        try{
            await fs.promises.writeFile(this.filename, JSON.stringify(contenidoJsonArray, null, 2));
        } catch (err) {
            throw new Error(`Error de escritura: ${err}`);
        }
        console.log(`Producto ${obj.title} con id: ${obj.id} agregado al catálogo`)
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


export default Contenedor;
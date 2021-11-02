import config from '../utils/config.js';

class ContenedorMemoria{

    constructor(){
        this.memoria = [];
    }

    async save(obj){
        let id;
        if(this.memoria.length>0){
            const ultimoId = this.memoria[this.memoria.length-1].id;
            obj.id = ultimoId + 1;
        } else {
            obj.id = 1;
        }
        obj.timestamp = Date.now();
        this.memoria.push(obj);
        console.log(`Producto ${obj.nombre} con id: ${obj.id} agregado al catálogo`)
        return obj.id;
    }

    async getById(id){                                                  
            const producto = this.memoria.find( (elem) => elem.id == id);
            return producto ? producto : null;
    }
    

    async getAll(){
            return this.memoria;
    }
    
    
    

    async deleteById(id){
        
        if(this.memoria.length==0){
            return null;
        }
        
        if(this.memoria.some( elem => elem.id ==id )){

            const index = this.memoria.findIndex( elem => elem.id == id);
            this.memoria.splice(index,1);
            
            console.log(`Producto con id:${id} borrado`)
        } else {
            throw new Error('ID ingresado no valido');
        }
    }

    async deleteAll(){
        this.memoria=[];
        console.log('Catálogo borrado')
    }

    async changeById(id, nuevo){
        
        if(this.memoria.some( elem => elem.id ==id )){
            nuevo.id= id;
            nuevo.timestamp= Date.now();
            let anterior;
            const index = this.memoria.findIndex( elem => elem.id == id);
            anterior =this.memoria[index];

            this.memoria[index] = nuevo;
            console.log(`Producto con id:${id} actualizado`)
            return anterior;
        } else {
            return null;
        }
    }
    
}

export default ContenedorMemoria;
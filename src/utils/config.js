

const uriMongoDb= 'mongodb://localhost:27017/ecommerce';





export default {
    fileSystem: {
        path: './DB'
    },
    mongodb: {
        cnxStr: 'mongodb://localhost:27017/ecommerce',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: {
        pathCnxCredentials: './firestore/dblucas2-a4de1-firebase-adminsdk-rpskc-df8c7c192c.json'
    },
    archivo: {
        productosFilePath: './productos.txt',
        carritosFilePath: './carritos.txt'
    }

}

//export {connectionStringProductos, connectionStringCarritos}
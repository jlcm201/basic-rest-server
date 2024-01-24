const { dbConnection } = require('../db/config');
const express = require('express');
const cors = require('cors')

const paths = {
    api: 'api',
    auth: 'auth',
    categories: 'categories',
    products: 'products',
    search: 'search',
    users: 'users'
};

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = paths;

        // Connect DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    };

    async connectDB() {
        dbConnection();
    };

    middlewares() {
        // cors
        this.app.use(cors());

        // body reading and parsing
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));
    };

    routes() {
        this.app.use(`/${this.paths.api}/${this.paths.auth}`, require('../routes/auth'));
        this.app.use(`/${this.paths.api}/${this.paths.users}`, require('../routes/user'));
        this.app.use(`/${this.paths.api}/${this.paths.categories}`, require('../routes/categories'));
        this.app.use(`/${this.paths.api}/${this.paths.products}`, require('../routes/products'));
        this.app.use(`/${this.paths.api}/${this.paths.search}`, require('../routes/search'));
    };

    listen () {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });        
    };

};

module.exports = Server;
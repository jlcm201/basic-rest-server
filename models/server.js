const express = require('express');
const cors = require('cors')

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.pathAPI = 'api';
        this.pathUsers = 'users';

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
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
        this.app.use(`/${this.pathAPI}/${this.pathUsers}`, require('../routes/user'));
    };

    listen () {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });        
    };

};

module.exports = Server;
const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING
            // , {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
            // useCreateIndex: true,
            // useFindAndModify: false
            // }
        );
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Connection Error');
    }
};


module.exports = {
    dbConnection
};
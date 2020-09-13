require('dotenv').config();


module.exports = require('knex')({
    client:'mysql',
    connection : {
        host : process.env.HOST,
        user : 'root', // you can give your name of the root 
        password : process.env.PASSWORD,
        database : process.env.DATABASE
        
    }
},console.log("database is connected"));

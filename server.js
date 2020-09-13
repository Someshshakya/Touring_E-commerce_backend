const express = require('express');
const app = express();
app.use(express.json());
const router = require('./routes/router')
require('dotenv').config();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
// this will connect you database
const knex = require('./model/db_connection');
app.use(router);


var PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
});


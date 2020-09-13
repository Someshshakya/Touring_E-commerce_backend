const express = require('express');
const knex = require('../model/db_connection')
const jwt = require('jsonwebtoken');
const router = express.Router();
const AuthVerify = require('../jwt_middleware');
require('dotenv').config();
var key = process.env.SECRETE_KEY;


// This will work for Depatments
require('../controller/department')(knex,router);

// Here are the routes for Category
require('../controller/category')(knex,router);

//Here is Every thing about Attributes
require("../controller/attribute")(knex,router);

// This will work for all the endPoints related to product
require("../controller/products")(knex,router);

// Everything about Customer  
require('../controller/customers')(knex,router,jwt,key,AuthVerify);

//Everything about Orders
require('../controller/orders')(knex,router,jwt,key,AuthVerify)

// Everthing about shoppingcart
require('../controller/shoppingcart')(knex,router,jwt,key,AuthVerify);

// Everything about Tax
require("../controller/tax")(knex,router);

// Everthing about shipping
require('../controller/shipping')(knex,router)

module.exports = router;
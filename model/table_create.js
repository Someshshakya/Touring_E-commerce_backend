const knex = require('../model/db_connection')

module.exports = knex.schema.hasTable('later_use')
.then(exists=>{
    if (!exists){
        knex.schema.createTable('later_use',(table)=>{
            table.increments("id"),
            table.integer('cart_id'),
            table.integer('product_id'),
            table.integer('item_id'),
            table.string('price'),
            table.string('attributes'),
            table.string('quantity'),
            table.string('name')
        })
        .then(data=>{
            console.log("Your table is ready with your given columns")
        })
        .catch(err=>{
            console.log(err)
        });
    }
});
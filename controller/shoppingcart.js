require('../model/table_create')
module.exports = (knex,shopping_cart,jwt,key,AuthVerify)=>{
    shopping_cart.get('/shoppingcart/generateUniqueId',(req,res)=>{
    const shortid = require('shortid');
    console.log(shortid.generate());
    var cart_id = shortid.generate();
    res.json({"card_it":cart_id,})
    });
    
    //Add a product in the cart
    shopping_cart.post('/shoppingcart/add',(req,res)=>{
        var body = req.body;
        const cart_id = body.cart_id;
        const product_id = body.product_id;
        const attributes = body.attributes;
        knex('shopping_cart').insert({
            quantity : 1,
            added_on : new Date(),
            cart_id : cart_id,
            product_id : product_id,
            attributes : attributes,
        })
        .where('cart_id',cart_id)
        .andWhere('product_id',product_id)
        .andWhere('attributes',attributes)
        .then(data=>{
           knex('shopping_cart') .innerJoin('product',"shopping_cart.product_id","product.product_id")
           .select('shopping_cart.item_id',
                   "product.name",
                   "shopping_cart.attributes",
                   "shopping_cart.product_id",
                   "product.price",
                   "shopping_cart.quantity",
                   "product.image" )
            .where("shopping_cart.product_id",product_id)
            .then(result =>{
                var subtotal = (result[0].price)*(result[0].quantity);
                result[0]["subtotal"] = subtotal
                res.json(result)
            })
            .catch(err=>{res.send(err)})
        })
        .catch(err=>{res.send(err)})
    });

    // Get list of products in shopping cart
    shopping_cart.get('/shoppingcart/:cart_id',(req,res)=>{
        knex('shopping_cart') .innerJoin('product',"shopping_cart.product_id","product.product_id")
           .select('shopping_cart.item_id',
                   "product.name",
                   "shopping_cart.attributes",
                   "shopping_cart.product_id",
                   "product.price",
                   "shopping_cart.quantity",
                   "product.image" )
            .where("shopping_cart.cart_id",req.params.cart_id)
            .then(result =>{
                var subtotal = (result[0].price)*(result[0].quantity);
                result[0]["subtotal"] = subtotal
                res.json(result)
            })
            .catch(err=>{res.send(err)})
    });

    // Updata cart by cart_id
    shopping_cart.put("/shoppingcart/update/:item_id",(req,res)=>{
        var item_id = req.params.item_id;
        knex('shopping_cart') .update({
            quantity:req.body.quantity
        })
        .where('shopping_cart.item_id',item_id)
        .then(data =>{
            knex('shopping_cart') .innerJoin('product',"shopping_cart.product_id","product.product_id")
           .select('shopping_cart.item_id',
                   "product.name",
                   "shopping_cart.attributes",
                   "shopping_cart.product_id",
                   "product.price",
                   "shopping_cart.quantity",
                   "product.image" )
            .where("shopping_cart.item_id",item_id)
            .then(result =>{
                var subtotal = (result[0].price)*(result[0].quantity);
                result[0]["subtotal"] = subtotal
                res.json(result)
            })
            .catch(err=>{res.send(err)})
        })
        .catch(err=>{
            res.send(err)
        })
    });
    

    // DELETE Cart 
    shopping_cart.delete("/shoppingcart/empty/:cart_id",(req,res)=>{
      var cart_id = req.params.cart_id;
      knex('shopping_cart') 
      .where("shopping_cart.cart_id",cart_id)
      .delete() 
      .then(data=>{
          res.json({msg:"cart deleted successfully"})
      })
      .catch(err=>{
          res.send(err)
      })
    });

    // Return a total amount
    shopping_cart.get("/shoppingcart/totalAmount/:cart_id",(req,res)=>{
        var cart_id = req.params.cart_id;
        knex('shopping_cart') .innerJoin('product',"shopping_cart.product_id","product.product_id")
        .select(
                "product.price",
                "shopping_cart.quantity" )
         .where("shopping_cart.cart_id",cart_id)
         .then(result =>{
             var subtotal = (result[0].price)*(result[0].quantity);
             res.json({"Total Amount":subtotal})
         })
         .catch(err=>{res.send(err)})
    });

    //Product saved for later
    shopping_cart.get("/shoppingcart/saveForLater/:item_id",(req,res)=>{
        var item_id = req.params.item_id;
        knex('shopping_cart') .innerJoin('product',"shopping_cart.product_id","product.product_id")
        .select('shopping_cart.item_id',
                "product.name",
                "shopping_cart.attributes",
                "shopping_cart.product_id",
                "product.price",
                "shopping_cart.quantity",
                "shopping_cart.cart_id")
         .where("shopping_cart.item_id",req.params.item_id)
         .then(result=>{
             if (result.length!=0){
                var to_store = result[0]
                knex('later_use')
                .insert(to_store)
                .where('later_use.item_id',item_id)
                .then(data=>{
                    res.send("Data stored in table for later use!");
                })
                .catch(err=>{res.send(err)})
             }else{
                res.json({msg:`Ther is no such product foun with item_id${req.prams.item_id}`})
             };
         })
         .catch(err=>{res.send(err)})
    });

    // Get product form later use data
    shopping_cart.get("/shoppingcart/getSaved/:cart_id",(req,res)=>{
        var cart_id = req.params.cart_id
        knex('later_use') 
        .select('later_use.item_id',
                "later_use.name",
                "later_use.attributes",
                "later_use.price")
         .where("later_use.cart_id",cart_id)
         .then(data=>{
             res.json(data)
         })
         .catch(err=>{
             res.send(err)
         })
    });

    // Delete a product from later use data
    shopping_cart.delete("/shoppingcart/removeProduct/:item_id",(req,res)=>{
   
        var item_id = req.params.item_id;
        knex('later_use') 
        .where("later_use.item_id",item_id)
        .delete() 
        .then(data=>{
            res.json({msg:"Product deleted successfully"})
        })
        .catch(err=>{
            res.send(err)
        })
      });   
}
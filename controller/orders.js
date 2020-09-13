const { decode } = require("jsonwebtoken");

module.exports = (knex,orders,jwt,key,AuthVerify)=>{
    orders.post('/orders',(req,res,next)=>{
        var token = req.headers.cookie.slice(10)
        var decoded = jwt.verify(token,key)
        var my_email = decoded.email;

        var body = req.body;
        var currentTime = new Date();
        var cart_id = body.cart_id;
        var shipping_id = body.shipping_id;
        var tax_id = body.tax_id;
        knex.select('customer_id') 
        .from('customer')
        .where('email',my_email)
        .then(data=>{
            if (data.length!=0){
                var customer_id = data[0].customer_id;
                console.log(data)
                knex('shopping_cart') .innerJoin('product',"shopping_cart.product_id","product.product_id")
                .select(
                    "shopping_cart.quantity",
                    "product.price"
                    )
                .where('shopping_cart.cart_id',cart_id)
                .then(result=>{
                    console.log(result)
                    var sub_total  = (result[0].quantity)*(result[0].price)
                    knex.select('shipping_cost') 
                        .from('shipping')
                        .where('shipping_id',shipping_id)
                    .then(cost=>{
                        console.log(cost)
                        let dollar = 73.48;
                        var shipping_cost = parseInt((cost[0].shipping_cost) * dollar )
                        knex.select('tax_percentage') 
                        .from('tax')
                        .where('tax_id',tax_id)
                        .then(tax=>{
                            console.log(tax)
                            let tax1 = (tax[0].tax_percentage)/100
                            let price_with_tax = sub_total-(sub_total*tax1)
                            var total_amount = price_with_tax + shipping_cost;
                            console.log(`total_amount ${total_amount}`)

                            /////  The order is created Here:)-

                            knex('orders') .insert({
                                cart_id : body.cart_id,
                                shipping_id : parseInt(body.shipping_id),
                                tax_id : parseInt(body.tax_id),
                                created_on : currentTime,
                                total_amount : total_amount,
                                customer_id : customer_id
                                })
                            .where("cart_id",cart_id)
                            .then(data =>{
                                // console.log(data);
                                knex.select('order_id as Order_id')
                                .from('orders')
                                .where('cart_id',cart_id)
                                .then(order=>{
                                    res.json(order)
                                })
                                .catch(err=>{
                                    console.log(err)
                                    res.send(err)
                                })
                                
                            })
                            .catch(err=>{
                                console.log(err)
                                res.json({err})
                        })
                        })
                        .catch(err=>{
                            console.log(err)
                            res.send(err)
                        })
                    })
                    .catch(err=>{
                        console.log(err)
                        res.send(err)
                    })
                
                })
            
                .catch(err=>{
                    res.send(err)
                })
            }else{
                res.send("Data not")
            }
        })
        .catch(err=>{
            res.send(err)
        })
    });

    
    ////Get order info by order_id
    orders.get("/orders/:id",AuthVerify,(req,res,next)=>{
        var order_id = req.params.id;
        knex('orders') 
        .innerJoin('shopping_cart','orders.cart_id','shopping_cart.cart_id')
        .innerJoin('product',"shopping_cart.product_id","product.product_id")
            .select(
                "shopping_cart.attributes",
                "shopping_cart.product_id",
                "product.name as product_name",
                "shopping_cart.quantity",
                "product.price as unit_cost",
                "orders.order_id"
            )
        .where('orders.order_id',order_id)
        .then(data=>{
            let sub_total = (data[0].unit_cost) * (data[0].quantity)
            data[0]["sub_total"] = sub_total;

            res.send(data)
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    })

    // Get orders by customer
    orders.get("/orders",AuthVerify,(req,res,next)=>{
        var token = req.cookies.userToken;
        var decoded = jwt.verify(token,key)
        var email = decoded.email;
        
        knex('customer') 
        .innerJoin('orders','orders.customer_id','customer.customer_id')
            .select("orders.customer_id") 
        .where('customer.email',email)
        .then(data=>{
           let customer_id = data[0].customer_id;
            knex.select("*")
            .from("orders")
            .where('customer_id',customer_id)
            .then(data=>{
                res.send(data)
            })
            .catch(err=>{
                console.log(err)
                res.send(err)
            })
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    })

 
        // Get orders by customer
        orders.get("/orders/shortDetail/:order_id",AuthVerify,(req,res,next)=>{
            knex('orders') 
            .innerJoin('shopping_cart','orders.cart_id','shopping_cart.cart_id')
            .innerJoin('product','shopping_cart.product_id','product.product_id')
            .select(
                "orders.order_id",
                "orders.total_amount",
                "orders.created_on",
                "orders.shipped_on",
                "orders.status",
                "product.name"
            )
            .where('orders.order_id',req.params.order_id)
            .then(data=>{
                console.log(data);
                res.send(data[0]);
            })
        })
    
}
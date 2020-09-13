const knex = require("knex");
const body_parser = require('body-parser');
var cookies = require("..//auth");
const { verify } = require("jsonwebtoken");


module.exports = (knex,customers,jwt,key,AuthVerify)=>{

    // Register a user
    customers.post('/customers',(req,res)=>{
        var data = req.body;
        knex('customer') .insert({
            name:data.name,
            password:data.password,
            email:data.email,
        })
        .then(result=>{
            res.json({msg:"Signed Up successFully!!"});
        })
        .catch(err=>{
            res.send(err)
        })
        
    })
   // Sign in the shopoing
    customers.post('/customers/login',(req,res)=>{
        knex.select('*').from('customer') .where('email',req.body.email)
        .then(data=>{
            // console.log(req.cookies.userToken);
            if (data.lenght!=0){
                if (data[0].password==req.body.password){
                    var time = "24h"
                    var payload = {email:req.body.email}
                    var token = jwt.sign(payload,key,{expiresIn:"24h"})
                    res.cookie('userToken',token);  
                    res.json({"customer":{"schema":data},"accessToken":token,"expires_in":time});
                }else{
                    res.json({msg:"your password or userId is Incorrect"})
                };
            }else{
                res.json({msg:"This user id does not exists!!"})
            };
        })
        .catch(err =>{
            console.log(err)
            res.send(err);
        })
    })
    // Update customer details 
    customers.put('/customer',AuthVerify,(req,res,next)=>{
        var token = req.cookies.userToken;
        var decoded = jwt.verify(token,key);
        var email = decoded.email; // email from token

        var body = req.body;
        knex('customer')
            .update({
                name:body.name,
                email:body.email,
                mob_phone:body.mob_phone,
                day_phone:body.day_phone,
                password:body.password,
                eve_phone:body.eve_phone
            })
            .where('customer.email',email)
        .then(data =>{
                res.json('updated successfully');

        })
        .catch(err=>{
            res.send(err);
        })
    })
    // Get a customer by id (with authentication) [token needed ]
    customers.get('/customer',(req,res,nex)=>{
        var token = req.cookies.userToken;
        var decoded = jwt.verify(token,key);
        var email = decoded.email;
        knex.select('*') .from('customer').where("email",email)
        .then(data=>{
            if (data.lenght!=0){
                res.json(data)
            }else{
                res.send("no data found")
            }
        })
        .catch(err=>{
            res.send(err)
        })
    });

    // Update the customer's address (with jwt)
    customers.put('/customers/address',AuthVerify,(req,res,next)=>{
        var body = req.body;
        knex('customer')
            .update({
            address_1:body.address_1,
            city:body.city,
            region:body.region,
            postal_code:body.postal_code,
            country:body.country,
            shipping_region_id:body.shipping_region_id
            })
            .where('customer.email',body.email)
        .then(data =>{
                res.json(' Your address updated successfully');

        })
        .catch(err=>{
            res.send(err);
        })
    })
    // Update credit card (with jwt)
    customers.put('/customers/creditCard',AuthVerify,(req,res,next)=>{
        var body = req.body;
        knex('customer')
            .update({
            credit_card:body.credit_card
            })
            .where('customer.email',body.email)
        .then(data =>{
                res.json(' Your Credit Card updated successfully');

        })
        .catch(err=>{
            res.send(err);
        })
    })
}

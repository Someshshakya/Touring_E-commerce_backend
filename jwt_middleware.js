const jwt = require('jsonwebtoken');
const knex = require("./model/db_connection");
require('dotenv').config();
module.exports = (req,res,next)=>{
    
    var token = req.cookies.userToken;
    console.log(token)
    
    jwt.verify(token,process.env.SECRETE_KEY,(err,data)=>{
        if (data!=undefined){
            knex('customer').havingIn('email',data.email)
            .then(result =>{
                if (result.length!=0){
                    next()
                }else{
                    res.json({msg:"data not found"})
                }
            })
            .catch(err=>{
                console.log(err)
                res.json({err});
            })
        }else{
            console.log("Please Login ")
            res.json({msg:"First You need to Login"})
        }

    });

}
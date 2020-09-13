const { route } = require("../routes/router");
module.exports = (knex,attributes)=>{
    var sms = 'There are no such attributes which you are trting to find!'
    attributes.get('/attributes',(req,res)=>{
        knex.select("*") .from("attribute")
        .then(data=>{
            if(data.length!=0){
            res.json(data);
            }else{
                res.json({msg:sms})
            };
        })
        .catch(err=>{
            console.log(err)
            res.json({err})
        })
    })
    attributes.get('/attributes/:attribute_id',(req,res)=>{
        knex.select("*") .from("attribute").where('attribute_id',req.params.attribute_id)
        .then(data=>{
            if(data.length!=0){
            res.json(data);
            }else{
                res.json({msg:sms})
            };
        })
        .catch(err=>{
            console.log(err)
            res.json({msg:sms})
        })
    });
    attributes.get('/attributes/values/:attribute_id',(req,res)=>{
        knex.select('attribute_value_id','value') .from('attribute_value') .where('attribute_id',req.params.attribute_id)
        .then(data=>{
            if (data.length!=0){
            console.log(data)
            res.json(data);
            }else{
                res.json({msg:"Ther are no such values found by attribute id"});
            };
        })

    })

    attributes.get('/attributes/inProduct/:product_id',(req,res)=>{
        knex.from('product_attribute') 
        .innerJoin('attribute_value','product_attribute.attribute_value_id','attribute_value.attribute_value_id')
        .innerJoin('attribute','attribute_value.attribute_id','attribute.attribute_id')
        .select('attribute_value.attribute_value_id','attribute_value.value','attribute.name')
        .where('product_id',req.params.product_id)
        .then(data=>{
            if (data.length!=0){
            console.log(data)
            res.json(data);
            }else{
                res.json({msg:"No Attributes  found by this product id"});
            };
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
    })

}

module.exports = (knex,shipping)=>{
    // Get all regions
    shipping.get('/shipping/regions',(req,res)=>{
        knex.select('*')
            .from('shipping_region')
        .then(data=>{
            if (data.length!=0){
                res.send(data)
            }else{
                res.send("data not found")
            }
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    })

    // Get tax by tax_id
    shipping.get('/shipping/regions/:id',(req,res)=>{
        knex.select('*')
            .from('shipping_region')
            .where('shipping_region_id',req.params.id)
        .then(data=>{
            if (data.length!=0){
                res.send(data)
            }else{
                res.send("data not found")
            }
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    })
}
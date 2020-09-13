
module.exports = (knex,tax)=>{
    // Get all taxes
    tax.get('/tax',(req,res)=>{
        knex.select('*')
            .from('tax')
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
    tax.get('/tax/:id',(req,res)=>{
        knex.select('*')
            .from('tax')
            .where('tax_id',req.params.id)
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

module.exports = (knex,department)=>{
    // Get all Departments
    const sms = 'There are no such departmen what you are trting to find'
    department.get('/departments',(req,res)=>{
        knex.select("*") .from('department')
        .then(data=>{
            if(data.length!=0){
            res.json(data);
            }else{
                res.json({msg:sms})
            };
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })

    })
    
    // Get departement by it's id

    department.get('/departments/:id',(req,res,next)=>{
        knex.select("*") .from('department') .where('department_id',req.params.id)
        .then(data=>{
            if(data.length!=0){
            res.json(data);
            }else{
                res.json({msg:sms})
            };
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
    })
};
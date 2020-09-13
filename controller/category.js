const { select } = require("../model/db_connection");
const { param } = require("../routes/router");


module.exports = (Knex,category)=>{

    // Get Categories
    category.get('/categories',(req,res,next)=>{
        Knex.select('*') .from('category').then(data=>{
            console.log(data)
            res.send(data)
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        });
    })

    // Get Category by ID
    category.get('/categories/:category_id',(req,res,next)=>{
        Knex.select('*') .from('category') .where('category_id',req.params.category_id).then(data=>{
            console.log(data);
            res.send(data);
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        });
    })

    // Get Categories of a Product
    category.get('/categories/inProduct/:product_id',(req,res,next)=>{
        Knex.from('category').innerJoin('product_category', 'category.category_id','product_category.product_id')
        .select('name','category.category_id','category.department_id')
        .where('product_id',req.params.product_id)
        .then(data=>{
            if(data.length!=0){
            res.json(data);
            }else{
                res.json({msg:"No Such Category found:!!"})
            };
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
    })

    // Get Categories of a Department
    category.get('/categories/inDepartment/:department_id',(req,res,next)=>{
        Knex.from('category').innerJoin('department','category.department_id','department.department_id')
        .select('category.category_id','category.department_id','category.description','category.name')
        .where('category.department_id',req.params.department_id)
        .then(data=>{
            console.log(data)
            res.send(data)
        }).catch(err=>{
            console.log(err)
            res.send(err)
        })

    })


};
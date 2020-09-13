const Knex = require("knex");

module.exports = (Knex,products)=>{
    //Get all the products
    products.get('/products',(req,res)=>{
        Knex.select('product.product_id',
        'product.name',
        'product.description',
        'product.price',
        'product.discounted_price',
        'product.thumbnail',
        'product.image',
        'product.image_2').from('product')
        .then(data=>{
            console.log(data)
            res.json({count:data.length,rows:data});
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    });
    //GET Products by their product id
    products.get('/products/:product_id',(req,res)=>{
        Knex.select("*") .from('product') .where('product_id',req.params.product_id)
        .then(data=>{
            if (data.length!=0){
            console.log(data)
            res.json(data);
            }else{
                res.json({msg:"No such Products Found by The Given Product id!!"});
            };
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    });
    // GET a list of products of categories
    products.get('/products/inCategory/:category_id',(req,res)=>{
        Knex.from('product_category') .innerJoin('product','product_category.product_id','product.product_id')
        .select('product.product_id','product.name','product.description','product.price','product.discounted_price','product.thumbnail') 
        .where('category_id',req.params.category_id)
        .then(data=>{
            console.log(data)
            res.json({count:data.length,rows:data});
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    });
        // GET a list of products of Department
    products.get("/products/inDepartment/:department_id",(req,res)=>{
        Knex.from('category') .innerJoin('product_category','category.category_id','product_category.category_id')
        .innerJoin('product','product_category.product_id','product.product_id',)
        .select('product.product_id','product.name','product.description','product.price','product.discounted_price','product.thumbnail') 
        .where('category.department_id',req.params.department_id)
        .then(data=>{
            console.log(data)
            res.json({count:data.length,rows:data});
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    });

    //GET a Detail of a product
    products.get('/products/:product_id/details',(req,res)=>{
        Knex.select('product.product_id',
        'product.name',
        'product.description',
        'product.price',
        'product.discounted_price',
        'product.thumbnail',
        'product.image',
        'product.image_2').from('product')
        .where('product_id',req.params.product_id)
        .then(data=>{
            console.log(data)
            res.json(data);
        })
        .catch(err=>{
            console.log(err);
            res.json(err);
        })
    });
    
    // GET a location of a product
    products.get('/products/:product_id/locations',(req,res)=>{
        Knex.from('product_category') .innerJoin('category','product_category.category_id','category.category_id')
        .innerJoin('department','category.department_id','department.department_id')
        .select('category.category_id',
        'category.name as category_name',
        'department.department_id',
        'department.name as department_name')
        .where('product_category.product_id',req.params.product_id)
        .then(data=>{
            if (data.length!=0){
                var department_name = 
                console.log(data)
                res.json(data);
            }else{
                res.json({msg:"No such Products Found by The Given Product id!!"});
            };
        })
        .catch(err=>{
            console.log(err)
            res.send(err)
        })
    });

    // GET reviews of a product by product id
    products.get('/products/:product_id/reviews',(req,res)=> {
        Knex.select(
            'product.name',
            'review',
            'rating',
            'created_on'
        )
            .from("review")
            .join("product", 'product.product_id', '=', 'review.product_id')
            .where('review.product_id', req.params.product_id)
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
            })
    });
};

const express = require('express')
const bp = require('body-parser')
const app = express()
const orm = require('orm');
const router = express.Router();

  app.use(router)
  app.use(bp.json());
  router.use(orm.express("mysql://root:@localhost/getdev", {
      define: (db, models,next)=>{
    models.data = db.define('data', {
        id: Number,
        first_name: String,
        last_name: String,
        email: String,
        gender: String,
        ip_address: String
    });
    next()
  }
}
   ) );

  router.get('/bucketlists', (req,res,next)=>{
     req.models.data.count({},(err,count)=>{
          if(err)throw err;
          let limit = typeof req.query.limit !== 'undefined' ? ( parseInt(req.query.limit) >100? 100: parseInt(req.query.limit)): 20;
          let pagecount = Math.ceil(count/limit);
          let currentpage = typeof req.query.page !== 'undefined' ? req.query.page: 1;
          let offset = (currentpage > 1) ?((currentpage -1) * limit): 0;
          let result = req.models.data.find({},{
              limit,offset}, (err,data)=>{
                  if(err)throw err;
                  res.json({
                      data,limit,pagecount,currentpage
                  })
              }
          )
      })
  })
app.listen(5555)

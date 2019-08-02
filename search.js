import express from 'express'
import bp from 'body-parser'
import orm from 'orm'

const app = express()
const router = express.Router();

  app.use(router)
  app.use(bp.json());
  router.use(orm.express("mysql://root:@localhost/getdev", {
      define: (db, models,next)=>{
    models.data = db.define('bucketlist1', {
        id: Number,
        name: String,
        date_created: String,
        date_modified: String,
        done: Boolean
    });
    next()
  }
}
   ) );

  router.get('/bucketlists', (req,res,next)=>{
     req.models.data.find({name: req.query.q},(err,result)=>{
        if(!!err)throw err;
        res.json(result)
      })
  })
app.listen(5555)

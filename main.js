const express = require('express')
const bp = require('body-parser')
const session = require('express-session')
const store = require('express-mysql-session')
const cors = require('cors')

const conn = require('./dbconfig')

const app = express()
const SqlStore = store(session)
let sesStore = new SqlStore({}, conn)

app.use(bp.json());
app.use(cors())
app.use(session(
  {
    secret: 'getdevassignment',
    resave: false,
    saveUninitialized: false,
    store: sesStore
}
))

//login
app.post('/auth', (req,res)=>{
  const {username, password} = req.body;
  if(req.session.isLoggedIn){
    res.send('user is logged in')
  }else{
  conn.query('SELECT * FROM users WHERE user=? AND password=?',[username,password], (err,rows, field)=>{
    if(!err){
      req.session.user = username;
      if(rows.length===1){
        req.session.isLoggedIn = true;
        res.send('successful');
      }else{
        res.send('not successful')
      }
    }else{
      console.log(err);
      res.sendStatus(500)
    } 
  })
}
})

//logout
app.get('/auth/logout', (req,res)=>{
  req.session.destroy(err=>{
    if(err)console.log('an error occured',err);
    sesStore.close();
  })
  res.send('logged out')
})
app.post('/bucketlists', (req,res)=>{
  const { isLoggedIn, user } = req.session
  if(isLoggedIn){
    { name, item, dateCreatedStamp, dateModifiedStamp }
    conn.query('INSERT INTO bucketlist (name, item, date_created, date_modified, created_by) VALUES (?,?,?,?,?)',[name, item, dateCreatedStamp, dateModifiedStamp,user],(err,rows, field)=>{
      if(!err){
        res.send('bucketlist created successfully')
        console.log(rows)
      }else{
        res.send('FAILED')
        console.log(err)
      }
    })
  }else{
    res.send('not logged in')

  }
})


//post to the bucketlist
app.post('/bucketlists/id',(req,res)=>{
  const { isLoggedIn, user } = req.session
  const { item} = req.body
  if(isLoggedIn){
    conn.query(`UPDATE bucketlist SET item=concat(ifnull(item,""), ',?') WHERE id=? AND user=?`,[item,req.query.id,user],(err,rows, field)=>{
      if(!err){
        res.send('bucketlist successfully updated')
        console.log(rows)
      }else{
        res.send('FAILED')
        console.log(err)
      }
    })
  }else{
    res.send('not logged in')

  }
})

//lists all bucketlists
app.get('/bucketlists', (req,res)=>{
  const { isLoggedIn, user } = req.session
  if(isLoggedIn){
    conn.query('SELECT * FROM bucketlist WHERE user=?',[user],(err,rows,field)=>{
      if(!err){
        console.log(rows)
        res.json(rows)
      }else{
        console.log(err)
      }
    })
  }else{
    res.send('cant perform this action')
  }
})

//select one item on the list
app.get('/bucketlists.:id', (req,res)=>{
  const { isLoggedIn, user } = req.session
  if(isLoggedIn){
    conn.query('SELECT * FROM bucketlist WHERE user=? AND id=?',[user,req.params.id], (err,rows,field)=>{
      if(!err){
        res.json(rows)
      }else{
        console.log(err);
        res.end()
      }
    } )
  }else{
    res.send('not logged in')
  }
})

//modify one item on the list
app.put('/bucketlists.:id', (req,res)=>{
  const { isLoggedIn, user } = req.session
  if(isLoggedIn){
    conn.query('UPDATE bucketlist SET item=? WHERE user=? AND id=?',[req.body.update,user,req.params.id], (err,rows,field)=>{
      if(err)res.send('error occured while updating');
      res.send('successful',rows);
    })
  }else{
    res.send('not logged in')
  }
})

//delete one item on the list
app.delete('/bucketlists.:id', (req,res)=>{
  const { isLoggedIn, user } = req.session
  if(isLoggedIn){
    conn.query('DELETE FROM bucketlist WHERE user=? AND id=?',[user,req.params.id], (err,rows,field)=>{
      if(err)res.send('error occured while deleting');
      res.send('successfully deleted');
    })
  }else{
    res.send('not logged in')
  }
})

app.listen(5555)
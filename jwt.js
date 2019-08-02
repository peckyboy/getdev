import express from 'express'
import bp from 'body-parser'
import jwt from 'jsonwebtoken'

import conn from './dbconfig'
  
const app = express()

app.use(bp.json());

const login = (req,res)=>{
    const {user:username, password} = req.body;
    conn.query('SELECT * FROM users WHERE user=? AND password=?',[username,password], (err,rows, field)=>{
        if(!err){
          if(rows.length===1){
            jwt.sign({username}, 'thisIsASecret', { expiresIn: '5d' }, (err,token)=>{
                if(err)res.send({err});
                res.send({token})
            })
          }else{
            res.send('username or password incorrect')
          }
        }else{
            res.send('something went wrong with the connection')
        }
    })
}

const verify = (req, res, next)=>{
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken
        next()
    }else {
        res.sendStatus(403)
    }
}

const verifyToken = ({token},res,next)=>{
    jwt.verify(token, 'thisIsASecret', (err,auth)=>{
        if(err)res.sendStatus(505);
        res.send(auth)
    })
}
        
app.post('/login', login)
app.get('/logout', verify, verifyToken, (req,res)=>{
    res.send('yeah yeah')
})
app.post('/bucketlists/', verify, verifyToken, (req,res)=>{
    res.send(true)
})
app.get('/bucketlists/', verify, verifyToken, (req,res)=>{
    res.send(true)
})
app.get('/bucketlists/:id', verify, verifyToken, (req,res)=>{
    res.send(true)
})
app.put('/bucketlists/:id', verify, verifyToken, (req,res)=>{
    res.send(true)
})
app.delete('/bucketlists/:id', verify, verifyToken, (req,res)=>{
    res.send(true)
})
app.post('/bucketlists/:id/items', verify, verifyToken, (req,res)=>{
    res.send(true)
})
app.put('/bucketlists/:id/items/:item_id', verify, verifyToken, (req,res)=>{
    res.send(true)
})
app.delete('/bucketlists/:id/items/:item_id', verify, verifyToken, (req,res)=>{
    res.send(true)
})


app.listen(5555)
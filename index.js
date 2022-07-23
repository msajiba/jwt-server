const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send({message: 'user unAuthorize'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded)=> {
        if(err){
            res.status(403).send({message: 'Forbidden'})
        }
        req.decoded = decoded;
        next();
    })
}


//LOGIN METHOD
app.post('/login', (req, res)=>{
    const email = req.body.email;
   if(email){
        const accessToken = jwt.sign({email: email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
        res.send({
            status:200,
            accessToken: accessToken
        });
   }
   else{
    res.send({message: 'user unAuthorize'})
   }
});


app.get('/products', verifyJWT, (req, res) => {
    const product = [{id:'01', item:"test"}];
    res.send(product);
});


app.listen(port, ()=>{
    console.log('Listening to port', port);
});
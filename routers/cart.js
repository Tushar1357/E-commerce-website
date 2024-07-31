const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
require('dotenv').config()


const routers = express.Router()


const secret_key = process.env.SECRET_KEY

const middleware = (req,res,next)=>{
    const token = req.cookies.cssid
    if (token){
        jwt.verify(token,secret_key,(err,result)=>{
            if(err){
                res.send("No user found")
            }
            else if (result){
                req.details = result
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }
}

routers.post('/cart-value',middleware,(req,res)=>{
    const email = req.details.email
    const {cart_value} = require('./add_to_cart')
    res.json(cart_value[email])
})

const cart_page = fs.readFileSync(path.join(__dirname,'../public/cart_page.html'))
routers.get('/',middleware,(req,res)=>{
    
    res.end(cart_page)
})

module.exports = routers
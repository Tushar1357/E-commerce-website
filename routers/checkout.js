const express = require('express')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const secret_key = process.env.SECRET_KEY


const routers = express.Router()

const middleware = (req,res,next)=>{
    const token = req.cookies.cssid
    if (token){
        jwt.verify(token,secret_key,(err,result)=>{
            if(err){
                res.redirect('/login')
            }
            else if (result){
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }
}

const checkout_page = fs.readFileSync(path.join(__dirname,'../public/checkout.html'),'utf-8')
routers.get('/',middleware,(req,res)=>{
    res.end(checkout_page)
})

module.exports  = routers
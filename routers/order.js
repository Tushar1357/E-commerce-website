const express = require('express')
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
                req.user_info = result
                next()
            }
        })
    }
    else{
        res.send("No user found")
    }
}

routers.post('/',middleware,(req,res)=>{
    try{
    const details = req.body
    const address_id = req.body.id
    const {cart_value} = require('./add_to_cart')
    const order_details = cart_value[req.user_info.email]
    res.send("Order received")
    }
    catch{
        res.status(404).send("Internal Error")
    }
    
})

module.exports = routers
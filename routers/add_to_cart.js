const express = require('express')
const jwt = require('jsonwebtoken')
const {get_product} = require('../controllers/product')
require('dotenv').config()


const add_to_cart_router = express.Router()

const cart_value = {}
const secret_key = process.env.SECRET_KEY


const middleware = (req,res,next)=>{
    const token = req.cookies.cssid
    if (token){
        jwt.verify(token,secret_key,(err,result)=>{
            if(err){
                res.send("No user found")
            }
            else if (result){
                next()
            }
        })
    }
    else{
        res.send("No user found")
    }
}

add_to_cart_router.post('/',middleware,async (req,res)=>{
    try{
    const details = req.body
    const decoded_info = jwt.decode(req.cookies.cssid)
    const email = decoded_info.email
    if (cart_value[email] === undefined){
        cart_value[email] = {'total-cost':0}
    }
    
    const cart_obj = cart_value[email]
    if (cart_obj[details.product] === undefined){
        cart_obj[details.product]= {}
        cart_obj[details.product]['quantity'] = 1
        const product_detail = await get_product(details.product)
        const cost = product_detail.price
        cart_obj[details.product]['cost'] = cost
        cart_obj['total-cost']+=cost
        }
    else{
        const cost = cart_obj[details.product]['cost']/cart_obj[details.product]['quantity']
        cart_obj[details.product]['quantity'] +=1
        cart_obj[details.product]['cost']+=cost
        cart_obj['total-cost']+=cost

    }
    
    
    res.send("Product Added")
    
}
catch(error){
    console.error(error)
}
})

add_to_cart_router.post('/dec-quantity',middleware,(req,res)=>{
    try{
        const details = req.body
    const decoded_info = jwt.decode(req.cookies.cssid)
    const email = decoded_info.email
    const cart_obj = cart_value[email]
    
    if (cart_obj[details.product]['quantity']>0){
        const cost = cart_obj[details.product]['cost']/cart_obj[details.product]['quantity']
    cart_obj[details.product]['quantity'] -=1
    cart_obj[details.product]['cost'] -= cost
    cart_obj['total-cost'] -= cost
    if (cart_obj[details.product]['quantity'] == 0){
        delete cart_obj[details.product]

    }

    res.send("product subtracted")
    }
    else{
        res.status(404).send("There was an error")
    }
    }
    catch(error){
        console.log(error)
    }

})


module.exports = {add_to_cart_router,cart_value}

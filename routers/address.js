const express = require('express')
const {add_address,get_address} = require('../controllers/address')
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
                req.details = result
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }
}

routers.post('/get_address',middleware,async(req,res)=>{
    try{
    const email = req.details.email
    const details = await get_address(email)
    if (details){
        res.json(details)
    }
    else{
        res.status(500).send(false)
    }
}
catch{
    console.error("Error found")
}
})


routers.post('/add_address',middleware,async (req,res)=>{
    try{
    const body = req.body
    const email = req.details.email
    body['email'] = email
    if (await add_address(body)){
        res.send("Address added")
    }
    else{
        res.status(500).send("Error while adding address")
    }
}
catch{
    console.error("Error")
}
})

module.exports = routers
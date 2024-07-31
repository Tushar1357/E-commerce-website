const express = require('express')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret_key = process.env.SECRET_KEY

const routers = express.Router()

routers.get('/',(req,res)=>{
    const cookies = req.cookies.cssid
    
    if (cookies){
    jwt.verify(cookies,secret_key,(err,result)=>{
        if (result){
            res.render('home',{title:"Amrit Vani Store",loggedout: false,name: result.name})
        }
        else{
            console.log("error")
        }
    })
    
    }
    else{
        res.render('home',{title:"Amrit Vani Store",loggedout: true})
    }
})

routers.get('/getstatus',(req,res)=>{
    const status = JSON.parse(fs.readFileSync(path.join(__dirname,'../public/store_status.json'),'utf-8'))
    res.json(status)
})

module.exports = routers
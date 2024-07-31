const express = require('express')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { log } = require('console')
require('dotenv').config()

const admin_router = express.Router()

const secret_pass = process.env.SECRET_PASS
const secret_email = process.env.SECRET_EMAIL
const secret_key = process.env.SECRET_KEY




const main_page = fs.readFileSync(path.join(__dirname,'../public/admin_login.html'))

const middleware = (req,res,next)=>{
    const token = req.cookies.ssid
    if (token){
        jwt.verify(token,secret_key,(err,result)=>{
            if(err){
                res.redirect('/admin/login')
            }
            else if (result){
                next()
            }
        })
    }
    else{
        res.redirect('/admin/login')
    }
}

const login_middleware = (req,res,next)=>{
    const token = req.cookies.ssid
    if (token){
        jwt.verify(token,secret_key,(err,result)=>{
            if(err){
                next()
            }
            else if (result){
                res.redirect('/admin_panel/adminpanel')
            }
        })
    }
    else{
        next()
    }
}

admin_router.get('/login',login_middleware,(req,res)=>{
    res.end(main_page)
})

admin_router.post('/verify',(req,res)=>{
    const details = req.body
    bcrypt.compare(details.email,secret_email,(err,result)=>{
        if(err){
            console.log("Error")
        }
        else if(result){
            bcrypt.compare(details.password,secret_pass,(err,result)=>{
                if(err){
                    console.log("Error")
                }
                else if(result){
                    const token = jwt.sign({name:'amritvaniadmin'},secret_key,{expiresIn: 60*60*24*30})
                    res.cookie('ssid',token,{maxAge: 30*24*60*60*1000})
                    res.redirect('/admin_panel/adminpanel')
                }
                else{
                    res.send("Wrong Password")
                }
            })
        }
        else{
            res.send("Wrong email")
        }
    })
})



module.exports = {admin_router,middleware}
const express = require('express')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const {add_user} = require('../controllers/signup')

const routers = express.Router()

const signup_page = fs.readFileSync(path.join(__dirname,'../public/customer_signup.html'),'utf-8')
routers.get('/',(req,res)=>{
    res.end(signup_page)
})


routers.post('/signup',(req,res)=>{
    const details = req.body
    let hashed_password
    bcrypt.hash(details.password,10, (err,result)=>{
        if(err){
            res.status(500).send('An error occurred')
        }
        else if(result){
            details.password = result
            add_user(details).then(result=>{
                if (result){
                    res.send("Successfully registered!! Please go to login page to login")
                }
                else{
                    res.send("User already registered! Please login")
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = routers
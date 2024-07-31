const express = require('express')
const path = require('path')
const fs = require('fs')
const {find_user} = require('../controllers/login')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv')

const secret_key = process.env.SECRET_KEY
const routers = express.Router()

const login_page = fs.readFileSync(path.join(__dirname,'../public/customer_login.html'),'utf-8')
routers.get('/',(req,res)=>{
    res.end(login_page)
})

routers.post('/verify',(req,res)=>{
    const details = req.body
    try{
    find_user(details).then(user=>{
        if (user){
            bcrypt.compare(details.password,user.password,(err,result)=>{
                if (result){
                    const token = jwt.sign({email: details.email,name: user.name},secret_key,{expiresIn: 60*60*24*30})
                    res.cookie('cssid',token,{maxAge: 30*24*60*60*1000})
                    res.send(true)

                }
                else if(err){
                    console.error(err)
                }
                else{
                    res.send("Wrong password")
                }
            })
        }
        else{
            res.send("User is not registered")
        }
    })
}
catch{

}
    
})




module.exports = routers
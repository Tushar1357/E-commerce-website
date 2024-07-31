
const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const {engine} = require('express-handlebars')
const main_router = require('./routers/main_router')
const {admin_router} = require('./routers/admin_login')
const cookieParser = require('cookie-parser')
const admin_panel_router = require('./routers/admin_panel')
const product_router = require('./routers/products')
const customer_router = require('./routers/customer_login')
const customer_signup = require('./routers/customer_signup')
const {add_to_cart_router} = require('./routers/add_to_cart')
const cart_router = require('./routers/cart')
const address_router = require('./routers/address')
const checkout_router = require('./routers/checkout')

const app = express()
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
  };


const port = 3000 || process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views','./views')
app.use(express.static(path.join(__dirname,'public')))
app.use('/node_modules',express.static(path.join(__dirname,'node_modules')))
app.use(cors(corsOptions));




app.use('/',main_router)
app.use('/admin',admin_router)
app.use('/admin_panel',admin_panel_router)
app.use('/products',product_router)
app.use('/login',customer_router)
app.use('/register',customer_signup)
app.use('/cart',cart_router)
app.use('/add_to_cart',add_to_cart_router)
app.use('/checkout',checkout_router)
app.use('/address',address_router)

app.listen(port,()=>{
    console.log(`Server listening on port : ${port}`)
})
const express = require('express')
const {middleware} = require('./admin_login')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const {add_product, find_product,get_product_for_category,delete_product} = require('../controllers/product')


const content = fs.readFileSync(path.join(__dirname,'../public/admin_panel.html'))



const router = express.Router()

const storage = multer.diskStorage({
    destination: async (req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/images'))
        
        
    },
    filename: async (req,file,cb)=>{
        if (await find_product(req.body.product)){
        const product_name = req.body.product
        const ext = path.extname(file.originalname)
        const filename = `${product_name}${ext}`
        cb(null,filename)
        }
        else{
            cb(null,"default.jpg")
        }
    }
})


const upload = multer({storage: storage})

router.post('/add_product',middleware,upload.single('image'),async (req,res)=>{
    if (!req.file){
        return res.status(400).send('No file uploaded')
    }
    const image_url = `/images/${req.file.filename}`
    let body = req.body
    body['image'] = image_url
    if(await find_product(req.body.product)){
    await add_product(body)
    res.end("<h1>Product has been successfully added to the product list</h1>")}
    else{
        res.send('<h1>Product already exist</h1>')
    }
    
})


router.get('/adminpanel',middleware,(req,res)=>{
    res.end(content)
})

router.post('/status',middleware,(req,res)=>{
    try{
    const newstatus = req.body
    console.log(newstatus)
    fs.writeFileSync(path.join(__dirname,"../public/store_status.json"),JSON.stringify(newstatus))
    res.send(`Status has been updated to ${newstatus.status}`)
    }
    catch(error){
        res.status(500).send('An error occurred while updating the status! Please try again')
    }
})


router.post('/deleteproduct',middleware,async (req,res)=>{
    const product_name = req.body.product
    if (await delete_product(product_name)){
        res.send("Product has been successfully deleted")
    }
    else{
        res.status(400).send("An error occurred while deleting product")
    }
    
})
module.exports = router
const express = require('express')
const {get_product_for_category} = require('../controllers/product')
const routers = express.Router()


routers.get('/',(req,res)=>{
    console.log('hello')
})
routers.get('/getcategoryprod/:category',async (req,res)=>{
    const category = req.params.category
    try{
    const result = await get_product_for_category(category)
    res.json(result)
    }
    catch(error){
        console.error('Error')
        res.status(500).json({Error:"An error occurred"})
    }
})


module.exports = routers
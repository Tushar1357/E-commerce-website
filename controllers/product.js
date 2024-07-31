const mongoose = require('mongoose')

mongoose.connect('')


const product_schema = new mongoose.Schema({
    product: String,
    price: Number,
    quantity: Number,
    category: String,
    image: String,
    date: {type: Date,default: Date.now}
})

const Product = mongoose.model('product_List',product_schema)

const add_product = async (data)=>{
    await Product.create(data)
}

const find_product = async(name)=>{
    const result = await Product.findOne({product: name})
    if (result){
        return false
    }
    return true
    
}

const get_product_for_category = async(cat_name)=>{
    const result = await Product.find({category: cat_name})
    return result
}

const delete_product = async(product_name)=>{
    const result = await Product.find({product: product_name})
    if (result){
        await Product.deleteOne({product: product_name})
        return true
    }
    return false
}

const get_product = async(product_name)=>{
    const result = await Product.findOne({product: product_name})
    if (result){
        return result
    }
    return false
}
module.exports = {add_product,find_product,get_product_for_category,delete_product,get_product}





const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    hno: {type:String, required:true},
    area:{type:String, required:true},
    landmark: {type:String, required:true},
    city: {type: String, required:true},
    email: {type:String, required:true},
})

const address_model = mongoose.model('address',Schema,'address')

const add_address = async(details)=>{
    try{
    await address_model.create(details);
    return true
    }
    catch{
        console.log("Error")
        return false
    }
}

const get_address = async(email)=>{
    const result = await address_model.find({email: email})
    if (result){
        return result
    }
    return false
}


module.exports = {add_address,get_address}
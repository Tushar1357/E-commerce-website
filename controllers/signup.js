const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String,required: true},
    email: {type: String, required:true,unique:true},
    date: {type: Date,default: Date.now}
})

const users_model = mongoose.model('users',schema,'store_user_details')

const find_user = async(info)=>{
    const user = await users_model.findOne({email:info.email})
    try{
    if (user){
        return false
    }
    return true
}
catch{

}
}


const add_user = async(info)=>{
    if (await find_user(info)){
        try{
            await users_model.create(info)
            return true
        }
        catch(error){
            console.error(error)
        }
    }
    return false
}

module.exports = {add_user}
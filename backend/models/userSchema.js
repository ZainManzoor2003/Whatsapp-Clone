const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    password: String,
    img: String,
})

const User = new mongoose.model('User', userSchema);

module.exports=User;
const mongoose=require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: String,
    reciever: String,
    message: String,
    type:String,
    time: String

})

const Message = new mongoose.model('Message', messageSchema);

module.exports=Message;
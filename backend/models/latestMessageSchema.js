const mongoose=require('mongoose')

const latestMessageSchema = new mongoose.Schema({
    sender: String,
    reciever: String,
    number: String,
    name: String,
    img: String,
    latestMsg: String,
    type:String,
    time: String

})

const LatestMessage = new mongoose.model('LatestMessage', latestMessageSchema);

module.exports=LatestMessage;
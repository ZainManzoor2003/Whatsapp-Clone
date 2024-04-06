const User = require('../models/userSchema');
const Message = require('../models/messageSchema');
const LatestMessage = require('../models/latestMessageSchema');
const jwt = require('jsonwebtoken')

const connection=(req,res)=>{
    res.send('Hello');
}

const login = (req,res) => {
        try {
            User.findOne({ number: req.body.number }).then((user, err) => {
                if (user) {
                    if (req.body.password === user.password) {
                        const tokenData = {
                            username: user.username,
                            id: user._id
                        }
                        const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY);
                        res.send({ mes: 'Login Successfull', user, token })
                    }
                    else {
                        res.send({ mes: 'Wrong Password' })
                    }
                }
                else {
                    res.send({ mes: 'User Not Found' });
                }
            })
        } catch (err) {
            console.log(err);
        }
}

const register=(req,res)=>{
    try {
        User.findOne({ number: req.body.number }).then((user, err) => {
            if (user) {
                res.send({ mes: 'Number Already Registered ' })
            }
            else {
                const user = new User(req.body);
                user.save((user, err))
                if (user) {
                    res.send({ mes: 'Account Registered Succesfully' });
                }
                else {
                    console.log(err);
                }
            }

        })
    } catch (err) {
        console.log(err);
    }
}
const updateProfile=async(req,res)=>{
    try {
        const id = req.params.id;
        await User.updateOne({ _id: id }, req.body).then((user) => {
            if (user) {
                res.send({ mes: 'Account Updated Succesfully' })
            }
            else {
                res.send({ mes: 'Unable to Update Account' });
            }
        })
    } catch (err) {
        console.log(err);
    }
}

const addContact=async(req,res)=>{
    const id = req.params.id;
    // console.log(req.body);
    try {
        await LatestMessage.findOne({ sender: id, reciever: req.body._id }).then((contact, err) => {
            if (contact) {
                res.send({ mes: 'Contact Already Added' })
            }
            else {
                const latestMessage = new LatestMessage({
                    sender: id, reciever: req.body._id, name: req.body.name, img: req.body.img, number: req.body.number,
                    latestMsg: '', time: '', type: ''
                });
                latestMessage.save();
                res.send({ mes: 'Contact Added Successfully', latestMessage: latestMessage });
            }
        })

    } catch (err) {
        console.log(err);
    }
}
const getAllUsers=async(req,res)=>{
    try {
        await User.find({}).then((user) => {
            if (user) {
                res.send(user);
            }
        })
    } catch (err) {
        console.log(err);
    }
}
const getContacts=async(req,res)=>{
    const id = req.params.id;
    try {
        await LatestMessage.find({ sender: id }).then((contact) => {
            if (contact) {
                res.send(contact);
            }
            else {
                res.send({ mes: 'No Contact Added' })
            }
        })
    } catch (err) {
        console.log(err);
    }
}

const getUserDetails=async(req,res)=>{
    const id = req.params.id;
    try {
        User.findOne({ _id: id }).then((user) => {
            if (user) {
                res.send(user);
            }
        })
    } catch (err) {
        console.log(err);
    }
}
const sendMessage=async(req,res)=>{
// let tempTime = new Date();
    // tempTime = tempTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    // const messageObj = { sender: req.params.id, reciever: req.params.reciever, message: req.body.message,type:req.body.type,time: tempTime };
    try {
        const message = new Message(req.body);
        message.save();
        latestMessageSave(req.params.id, req.params.reciever, req.body.message, req.body.time, req.body.type);
        res.send({ mes: 'Success' });
    }
    catch (err) {
        console.log(err);
    }
}

const latestMessageSave = async (id, reciever, message, time, type) => {
    const messageObj = { latestMsg: message, time: time, type: type }
    await LatestMessage.findOneAndUpdate({ sender: id, reciever: reciever }, messageObj)
    await LatestMessage.findOneAndUpdate({ sender: reciever, reciever: id }, messageObj)
}
const getMessages=async(req,res)=>{
    try {
        // Message.find({ $or: [{ sender: req.params.id, reciever: req.params.reciever }, { sender: req.params.reciever, reciever: req.params.id }] })
        Message.find({})
            .then((message) => {
                if (message) {
                    res.send(message)
                }
            })
    } catch (err) {
        console.log(err);
    }
}

const verifyAuth = (req, res, next) => {
    const token = req.body.cookie;
    if (!token) {
        res.send({ mes: 'Token Missing' })
    }
    else {
        jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
            if (err) {
                res.send({ mes: 'Error with token' })
            }
            else {
                next();
                // console.log(decoded);
            }
        })
    }
}
const verifyHome=async(req,res)=>{
    res.send({ mes: 'Success' })
}
const verifyAddContacts=async(req,res)=>{
    res.send({ mes: 'Success' })
}


module.exports={connection,login,register,updateProfile,addContact,getAllUsers,getContacts,
    getUserDetails,sendMessage,getMessages,verifyHome,verifyAddContacts,verifyAuth}
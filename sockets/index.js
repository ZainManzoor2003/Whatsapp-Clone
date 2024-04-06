import { Server } from 'socket.io';
// import { LocalStorage } from "node-localstorage";
// let localStorage = new LocalStorage('./scratch')

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:3000',
    },
})

let users = [];

const removeUser = (id) => {
    users = users.filter(user => user.id !== id);
}

const checkUser = (userData) => {
    // console.log('before', users);
    users = users.filter(function (user) {
        return user.id !== userData.id;
    });
    // console.log('after', users);
    return true
}
const addUser = (userData, socketId) => {
    if (checkUser(userData)) {
        users.push({ ...userData, socketId })
    }
    // !users.some(user => user.id == userData.id) && users.push({ ...userData, socketId });
    // console.log(users);
}
const getUser = (userId) => {
    // console.log(users);
    return users.find(user => user.id === userId);
}

const changeStatusToTyping = (id) => {
    let temp = users.map(user => {
        if (user.id === id) {
            return {
                ...user, status: 'typing...'
            }
        }
        return user;
    })
    users = temp;
}

const changeStatusToOnline = (id) => {
    let temp = users.map(user => {
        if (user.id === id) {
            return {
                ...user, status: 'Online'
            }
        }
        return user;
    })
    users = temp;
}


io.on('connection', (socket) => {
    console.log(`User connected with id ${socket.id}`)

    // connect
    socket.on('addUser', userData => {
        // console.log(userData);
        addUser(userData, socket.id);
        // console.log('all users are ',users);
        io.emit("getUsers", users);
    })

    //send message
    socket.on('sendMessage', (data) => {
        const userOnline = users?.find(user => user.id === data.reciever);
        if (userOnline) {
            const user = getUser(data.reciever)
            console.log(user.socketId);
            // console.log(users);
            io.to(user.socketId).emit('getMessage', data)
            console.log(data);
            // console.log(users);
            console.log(user);
        }
    })

    //change Status To Typing
   
    socket.on('changeStatusToTyping', (id) => {
        const userOnline = users?.find(user => user.id === id);
        if (userOnline) {
            changeStatusToTyping(id);
            io.emit('getUsers', users);
        }
    })

    //change Status 
    socket.on('changeStatusToOnline', (id) => {
        const userOnline = users?.find(user => user.id === id);
        if (userOnline) {
            changeStatusToOnline(id);
            io.emit('getUsers', users);
        }
    })
    // //disconnect
    socket.on('disconnected', (id) => {
        console.log('user disconnected');
        removeUser(id);
        console.log(socket.id);
        io.emit('getUsers', users);
    })
})
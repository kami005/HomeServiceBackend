const express = require('express')
const cors= require('cors')
const mongoose= require('mongoose')
const socketio = require('socket.io');
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri= process.env.ATLAS_URI
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}
)

const connection = mongoose.connection

connection.once('open', ()=>{
    console.log('MongoDB database connection established successfuly')
})

const qouteRouter = require('./routes/qoute')
const userRouter= require('./routes/users')
const sessionRouter= require('./routes/userSession')
const messageRouter = require('./routes/messages')

// heroku

if(process.env.NODE_ENV ==='production' || process.env.NODE_ENV ==='development'){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get('/', (req, res)=>{
        res.json('THIS APP HAS NO BODY')
    })
}

app.use('/qoute', qouteRouter)
app.use('/user', userRouter)
app.use('/session', sessionRouter)
app.use('/messages', messageRouter)


// NODE SERVER
var server = app.listen(port, ()=>{
    console.log(`MongoDB Server is running on port:${process.env.PORT ? process.env.PORT:5000}`)
})


// SOCKET IO
const io = socketio(server,{
cors:{
    methods:('GET', 'POST')
}
});


io.on("connection", (socket) => {
    // console.log(`User Connected: ${socket.id}`);

    // socket.broadcast.emit("connected", {socket:socket.id});

    socket.on("send_beacon", (data) => {
  
      socket.broadcast.emit("receive_beacon", {
        socket:data.mySocket,
        username:data.user,
      });
    });

    socket.on("receive_beacon", (data) => {
    
        socket.broadcast.emit("reply_beacon", {
          socket:data.mySocket,
          username:data.user,
        });
      });

      socket.on("send_message", (data) => {
        socket.broadcast.to(data.socket).emit("get_message", {
          socket:data.mySocket,
          sender:data.sender,
          message:data.message,
          msgID:data.msgID
        });
      });

    socket.on('receive_message', (data)=>{
      socket.broadcast.to(data.socket).emit("message_received", {
        socket:data.mySocket,
        sender:data.sender,
        msgID:data.msgID
      });
    })

    socket.on('open_message', (data)=>{
      socket.broadcast.to(data.socket).emit("message_opened", {
        socket:data.socket,
        sender:data.sender,
        msgID:data.msgID
      })
    })

    socket.on('disconnect', () => {+
        socket.broadcast.emit("send_offline", {socketID:socket.id,});
    });

});







const io=require('socket.io')(process.env.PORT || 8000,{
    cors:{
        origin:"*"
    }
})
// const { execSync }=require('child_process')
// const cors=require("cors");
// io.use(cors(
//     {origin : "*"}
// ))
const users={};
io.on('connection',socket=>{
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        io.emit('send-data',users);
    });
 
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message ,name: users[socket.id]})
    });

    socket.on('disconnect', message=>{
        
         socket.broadcast.emit('left',users[socket.id]);
         socket.broadcast.emit('remove',socket.id);
        delete users[socket.id];
        
    });
   
})

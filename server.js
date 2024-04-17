const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


let chatMessages = {};


io.on('connection', function(socket){
    console.log('Usuario conectado');

    
    for (let userId in chatMessages) {
        for (let message of chatMessages[userId]) {
            socket.emit('chat message', message);
        }
    }

    
    socket.on('chat message', function(data){
        console.log('Mensaje recibido: ' + data.message);
        data.time = new Date().toLocaleTimeString(); 
        io.emit('chat message', data);
        if (!chatMessages[data.username]) {
            chatMessages[data.username] = [];
        }
        chatMessages[data.username].push(data);
    });
    socket.on('disconnect', function(){
        console.log('Usuario desconectado');
    });
});

// Iniciar el servidor HTTP en el puerto 3000
http.listen(3000, function(){
    console.log('Servidor escuchando en http://localhost:3000');
});

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);



// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });
app.get('/', function(req, res){
    res.sendFile(__dirname + '/sock.html');
  });
io.on('connection', function(socket){
console.log('a user connected');
socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


// io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
// io.on('connection', function(socket){
//     socket.on('chat message', function(msg){
//       io.emit('chat message', 123);
//     });
//   });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
module.exports = function (io,rooms) {
  var chatrooms = io.of('/roomlist').on('connection', function(socket) {
    console.log('Connection Established on the server');
    socket.emit('roomupdate',JSON.stringify(rooms));
    socket.on('newroom',  function(data) {
      rooms.push(data);
      socket.broadcast.emit('roomupdate',JSON.stringify(rooms));
      socket.emit('roomupdate',JSON.stringify(rooms));
    });
  });
  var messages = io.of('/messages').on("connection", function(socket) {
    console.log('connected to the chatroom!');
    socket.on('joinroom', function(data) {
      socket.username = data.user;
      socket.userPic = data.userPic;
      socket.join(data.room);
      updateUsersList(data.room,true);
    });
    socket.on('newMessage', function(data) {
      socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
    });
    function updateUsersList(room, updateALL) {
      // var getUsers = io.of('/messages').clients(room); OLD VERSION
      var getUsers = io.of('/messages').in(room).clients;
      var userlist = [];
      for (var i in getUsers) {
        userlist.push({user:getUsers[i].username, userPic:getUsers[i].userPic});
      }
      socket.to(room).emit('updateUsersList',JSON.stringify(userlist));
      if (updateALL) {
        socket.broadcast.to(room).emit('updateUsersList', JSON.stringify(userlist));
        console.log('updateALL triggered');
      }
      console.log('updateUsersList function triggered');
    }
    socket.on('updateList', function(data) {
      updateUsersList(data.room);
      console.log('updateList triggered in socket.js');
    });
  });
};

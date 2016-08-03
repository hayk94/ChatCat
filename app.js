var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('./config/config.js');
var connectMongo = require('connect-mongo')(session);
var mongoose = require('mongoose').connect(config.dbURL);
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var rooms = [];

app.set('views',path.join(__dirname, 'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  //dev specific settings
  app.use(session({secret:config.sessionSecret}));
}
else {
  //production specific settings
  app.use(session({secret:config.sessionSecret,
    store: new connectMongo({
      // url:config.dbURL,
      mongoose_connection:mongoose.connections[0],
      // url:"mongodb://haykccuser:marcopolo@ds139645.mlab.com:39645/haykchatcat",

      stringify:true
    })
  }));
}

// var userSchema = mongoose.Schema({
//   username:String,
//   password:String,
//   fullname:String
// });
//
// var Person = mongoose.model('users', userSchema);
//
// var John = new Person({
//   username:'johndoe',
//   password:'mpoloz',
//   fullname:'John Doe'
// });
//
// John.save(function (err) {
//   console.log('Done!');
// });

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportauth.js')(passport,FacebookStrategy,config,mongoose);
require('./routes/routes.js')(express,app,passport,config);

// app.listen(3000, function () {
//   console.log('ChatCat working on Port 3000');
//   console.log('Mode: ' + env);
//   console.log("HAYK" + config.dbURL);
//
// });

app.set("port",process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io,rooms);
server.listen(app.get('port'), function () {
  console.log("ChatCAT on Port: " + app.get('port'));
});

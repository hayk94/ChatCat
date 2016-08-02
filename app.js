var express = require('express');
var app = express();
var path = require('path');
app.set('views',path.join(__dirname, 'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');
app.use(express.static(path.join(__dirname, 'public')));


require('./routes/routes.js')(express,app);

app.listen(3000, function () {
  console.log('ChatCat working on Port 3000');
});

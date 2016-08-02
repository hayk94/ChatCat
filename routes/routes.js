module.exports = function (express, app) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    res.render('index.html',{title:"Welcome to ChatCAT"});
  });

  router.get('/chatrooms', function (req,res,next) {
    res.render('chatrooms', {tite:'Chatrooms'});
  });

  router.get('/setcolor', function (req,res,next) {
    req.session.favColor = 'Red';
    res.send('setting favourite color!');
  });
  router.get('/getcolor', function (req,res,next) {
    res.send('Favourite Color ' + (req.session.favColor===undefined?"Not Found":req.session.favColor));
  });

  app.use('/',router);
};

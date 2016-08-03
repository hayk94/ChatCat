module.exports = function (express, app, passport,config) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    res.render('index.html',{title:"Welcome to ChatCAT"});
  });

  function securePages(req,res,next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      res.redirect('/');
    }
  }

  router.get('/auth/facebook',passport.authenticate('facebook'));
  router.get('/auth/facebook/callback',passport.authenticate('facebook', {
    successRedirect:'/chatrooms',
    failureRedirect:'/'
  }));

  router.get('/chatrooms', securePages, function (req,res,next) {
    res.render('chatrooms', {tite:'Chatrooms',user:req.user,config:config});
  });

  router.get('/logout', function (req,res,next) {
    req.logout();
    res.redirect('/');
  })

  // router.get('/setcolor', function (req,res,next) {
  //   req.session.favColor = 'Red';
  //   res.send('setting favourite color!');
  // });
  // router.get('/getcolor', function (req,res,next) {
  //   res.send('Favourite Color ' + (req.session.favColor===undefined?"Not Found":req.session.favColor));
  // });

  app.use('/',router);
};

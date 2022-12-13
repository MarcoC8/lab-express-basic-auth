const router = require("express").Router();
const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');

const {isLoggedIn, isAnon} = require('../middlewares/auth.middlesware');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post('/signup', isAnon, (req, res, next) => {
  if(!req.body.email || ! req.body.password){
    res.send('Sorry you forgot an email or password');
    return;
  }

  User.findOne({ username: req.body.username})
    .then(foundUser => {
      
      if(foundUser){
        res.render('signup.hbs', {errorMessage: 'Sorry! User already exists'});
        return;
      }

      const myHashedPassword = bcryptjs.hashSync(req.body.password)

      return User.create({
        email: req.body.username,
        password: myHashedPassword
      })
      
    })
    .then(createdUser => {
      console.log("here's the new user", createdUser);
      res.render('login.hbs');
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    })
});

router.get('/login', isAnon, (req, res, next) => {
  res.render('login.hbs')
});

router.post('/login', isAnon, (req, res, next) => {
  console.log(req.body);

  const { username, password } = req.body;

  if(!username || !password){
    res.render('login.hbs', { errorMessage: 'Sorry you forgot email or password' });
    return;
  }

  User.findOne({ username })
    .then(foundUser => {

      if(!foundUser){
        // res.send('Sorry user does not exist');
        res.render('login.hbs', { errorMessage: 'Sorry user does not exist' })
        return;
      }

      const isValidPassword = bcryptjs.compareSync(password, foundUser.password);

      
      if(!isValidPassword){
        // res.send('Sorry wrong password');
        res.render('login.hbs', { errorMessage: 'Sorry wrong password' })
        return;
      }

      req.session.user = foundUser;

      res.render('profile.hbs', foundUser)

    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
  
});

  router.get('/profile', isLoggedIn, (req, res, next) => {
  console.log(req.session);
  res.render('profile.hbs', req.session.user);
})

  router.get('/main', isAnon, (req, res, next) => {
  res.render('main.hbs')
})

  router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private.hbs')
})



router.get()

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/user');




router.get('/login', (req, res) => res.render('login'));
router.get('/registro', (req, res) => res.render('registro'));


router.post('/registro', (req, res) => {
  const { username, email, password, password2 } = req.body;
  
  let errors = [];


  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Por farvor preencha todos os campos' });

  }

  if (password != password2) {
    errors.push({ msg: 'As senhas não são iguais' });

  }

  if (errors.length > 0) {
    res.render('registro', {
      errors,
      username,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          
          errors.push({ msg: 'Este email já está cadastrado' })
          res.render('registro', {
            errors,
            username,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            username,
            email,
            password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'sucesso_msg',
                    'Voce está Registrado e agora pode se logar'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });

  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/testeupload',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Você está deslogado');
  res.redirect('/login');
});

module.exports = router;
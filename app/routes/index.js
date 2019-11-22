const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads' });
const User = require('../model/user');



let images = [];

function getImagesFromDir(dirPath) {
  let allImages = [];
  let files = fs.readdirSync(dirPath);
  for (file of files) {
    let fileLocation = path.join(dirPath, file);
    var stat = fs.statSync(fileLocation);
    if (stat && stat.isDirectory()) {
      getImagesFromDir(fileLocation);
    } else if (stat && stat.isFile()) {
      allImages.push('img/' + file);
    }
  }

  return allImages;
}



router.get('/', forwardAuthenticated, (req, res) => {
  res.render('index.ejs');
});

router.post('/upload', upload.single('arquivo'), (req, res) => {
  console.log(req.session.email)
  images.push(req.file.filename)
  // console.log(images);

  var post = { 'imgurl': 'img/' + req.file.filename, 'text': req.body.desc };
  User.findOneAndUpdate({ email: req.session.email }, { $push: { posts: post } }, { new: true }, (err, doc) => {
    if (err) {
      console.log("deu ruim!");
    }

    console.log(doc);
  });

  res.redirect('/testeupload');
});

router.get('/testeupload', ensureAuthenticated, (req, res) => {
   images = getImagesFromDir('./public/uploads')
  // console.log(images);
  // console.log(req.session.email);
  // let posts = [];
  // ultimate(req.session.email).then(result => {

  //   res.locals.user.posts = result.posts;
    
  // });
 
  res.render('upload.ejs', {
    images: images,
    
    name: req.user.username,
    // posts: posts

  });
  // console.log(res.locals.user);
  
});

module.exports = router;

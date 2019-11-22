const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads' });



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


router.get('/', (req, res) => {
  res.render('index.ejs');
});

router.post('/upload', upload.single('arquivo'), (req, res) => {
  images.push(req.file.filename)
  console.log(images);
  res.redirect('/testeupload');
});

router.get('/testeupload', ensureAuthenticated, (req, res) => {
  images = getImagesFromDir('./public/uploads')
  console.log(images);
  res.render('upload.ejs', { 
    images: images,
    name: req.user.username
    
  });
  // console.log(req.user.username);
});

module.exports = router;

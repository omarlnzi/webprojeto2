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
  // images.push(req.file.filename)

  if (typeof req.file !== 'undefined') {
    var post = { 'imgurl': 'img/' + req.file.filename, 'text': req.body.desc, 'date': '' };
    User.findOneAndUpdate(
      { email: req.session.email },
      {
        "$push": {
          posts: {
            "$each": [{
              imgurl: post.imgurl,
              text: post.text
            }],
            "$sort": { date: -1 }
          }
        }
      }, { new: true }, (err, doc) => {
        if (err) {
          console.log("deu ruim!");
        }

        console.log(doc);
      });

  }



  res.redirect('/testeupload');
});

router.get('/testeupload', ensureAuthenticated, (req, res) => {
  // images = getImagesFromDir('./public/uploads');

  User.findOne({ email: req.session.email }, 'posts', function (err, doc, ) {
    console.log(doc.posts);
    if (err) {
      console.log("deu ruim!");
    }
    res.render('upload.ejs', {
      posts: doc.posts,
      name: req.user.username,
    });
  });


  // console.log(res.locals.user);

});

module.exports = router;

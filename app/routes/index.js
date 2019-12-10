const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads' });
const User = require('../model/user');
const bodyParser = require('body-parser');



let images = [];
// router.use(bodyParser.urlencoded());
// router.use(bodyParser.json());
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


router.post('/editcompra', ensureAuthenticated, function (req, res, next) {
  var post = { product: req.body.product, qtde: req.body.qtde, id: req.body.id };
  console.log('post_id', post.id)
  User.findOneAndUpdate(
    { email: req.session.email, "shoplist._id": post.id },{
      "$set": {
        "shoplist.$.product": post.product,
        "shoplist.$.qtde": post.qtde,
      }
    }, { new: true }, (err, doc) => {
      if (err) {
        console.log("deu ruim!", err);

        res.send(JSON.stringify({ error: err }))
      } else {
        res.send(JSON.stringify(doc))
        console.log('deu bom', doc)
        console.log('origin', post.id)
        
  
      }
    })
});

router.post('/deletecompra', ensureAuthenticated, function (req, res, next) {
  var id = req.body.deleteid;
  
  User.findOneAndUpdate(
    {email: req.session.email},
    {
      "$pull": { shoplist: { _id: id } }
    }, { new: true }, (err, doc) => {

      if (err) {
        console.log("deu ruim!");
        res.send(JSON.stringify({ error: err }))
      }else{
        res.send(JSON.stringify({message: 'Excluido com sucesso'}))
      }
      

    })
});

router.post('/addcompra', ensureAuthenticated, function (req, res, next) {

  var post = { product: req.body.product, qtde: req.body.qtde };

  User.findOneAndUpdate(
    { email: req.session.email },
    {
      "$push": {
        shoplist: [{
          product: post.product,
          qtde: post.qtde
        }]
      }
    }, { upsert: true, new: true }, (err, doc) => {
      index = doc.shoplist.length - 1
      if (err) {
        console.log("deu ruim!");
        res.send(JSON.stringify({ error: err }))
      }
      res.send(JSON.stringify(doc.shoplist[index]))

    })
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



router.get('/loadtable', ensureAuthenticated, (req, res) => {
  // console.log(req.body)
  User.findOne({ email: req.session.email }, 'shoplist', function (err, doc, ) {
    // console.log(doc);
    if (err) {
      console.log("deu ruim!", err);
    } else {
      res.send(JSON.stringify(doc))
    }
  });
});

router.get('/compras', ensureAuthenticated, (req, res) => {
  res.render('compras.ejs', {

    name: req.user.username,
    email: req.user.email

  });
});
router.get('/testeupload', ensureAuthenticated, (req, res) => {
  // images = getImagesFromDir('./public/uploads');

  User.findOne({ email: req.session.email }, 'posts', function (err, doc, ) {
    // console.log(doc.posts);
    if (err) {
      console.log("deu ruim!");
    }
    res.render('upload.ejs', {
      posts: doc.posts,
      name: req.user.username,
      email: req.user.email
    });
  });

  
});
router.get('/updatecolor', ensureAuthenticated, (req, res) => {
  var newcolor= '#' + Math.random().toString(16).slice(2, 8).toUpperCase()
  res.send(JSON.stringify({color: newcolor}))
})


module.exports = router;

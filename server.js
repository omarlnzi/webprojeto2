let express = require('express'),
    path = require('path'),
    port = 3000,
    app = express(),
    // createError = require('http-errors'),
    // logger = require('morgan'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    upload = multer({ dest: 'public/uploads' }),
    images = [];
    
var Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://omar:mongosenha@cluster0-9f1lk.gcp.mongodb.net/projetobd?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var doc = mongoose.model('postagens', new Schema(
  {name : String, idade: String})
); 
doc.find({}, function(err,collection){ 
  console.log(collection)
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Conectado com sucesso');
  // db.collection("postagens", function(err, collection){
  //   db.find({}).toArray(function(err, data){
  //       console.log(data); // it will print your collection data
  //   })
  // });
});

//app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(__dirname + '/public/uploads'));

app.get('/', (req, res) => {
  res.send({
    title: "Meu yeye Express",
    version: "0.0.0.0.1"
  });
});
app.get('/a', (req, res) => {
  let nomes = ['Marcos','Omar','Pedro'];
  res.render('home', {nomes: nomes});
});


app.get('/testeupload', (req, res) => {
  images = getImagesFromDir(path.join(__dirname,'/public/uploads'))
  console.log(images);
  res.render('upload.hbs', { images: images });
});

app.post('/upload', upload.single('arquivo'), (req, res) => {
  images.push(req.file.filename)
  res.redirect('/testeupload');
});

app.listen(port, err => {
  console.log(`Server is listening on ${port}`);
});

function getImagesFromDir(dirPath){
  let allImages = [];
  let files = fs.readdirSync(dirPath);
  for(file of files){
    let fileLocation = path.join(dirPath, file);
    var stat = fs.statSync(fileLocation);
    if(stat && stat.isDirectory()){
      getImagesFromDir(fileLocation);
    }else if (stat && stat.isFile()){
      allImages.push('img/'+file);
    }
  }
  return allImages;
}
let express = require('express'),
    path = require('path'),
    port = 3000,
    app = express(),
    // createError = require('http-errors'),
    // logger = require('morgan'),
    mongoose = require('mongoose');
    
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
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(port, err => {
  console.log(`Server is listening on ${port}`);
});
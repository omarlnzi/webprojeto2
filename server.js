let express = require('express'),
    path = require('path'),
    port = 3000,
    app = express();

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
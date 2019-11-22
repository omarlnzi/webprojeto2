let express = require('express'),
  path = require('path'),
  port = 3000 || process.env.port,
  app = express(),
  mongoose = require('mongoose'),

  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  passport = require('passport'),
  cookieParser = require('cookie-parser');
  



 var Schema = mongoose.Schema;
require('./app/config/passport')(passport);
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');


const chave = require('./app/config/keys').mongoURI;
mongoose.connect(chave, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Conectado'))
  .catch(err => console.log(err));


mongoose.Promise = global.Promise;



app.use(express.urlencoded({ extended: false }));
var db = mongoose.connection;
app.use(cookieParser());
app.use(session({
    secret: 'my-precious',
    resave: false,
    saveUninitialized: true,
    idUser: 'oi',
    store: new MongoStore({ mongooseConnection: db })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.sucesso_msg = req.flash('sucesso_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

app.set('views', path.join(__dirname, 'app/views'));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./app/routes/index'));
app.use('/', require('./app/routes/users'));

app.use('/img', express.static(__dirname + '/public/uploads'));

app.listen(port, err => {
  console.log(`Server is listening on ${port}`);
});


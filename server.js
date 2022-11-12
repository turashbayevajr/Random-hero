var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://randomhero:azharnurda@cluster0.cw0qz.mongodb.net/notesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
//Mongo Things
mongoose.connect("mongodb+srv://randomhero:azharnurda@cluster0.cw0qz.mongodb.net/notesDB",
    // {useNewUrlParser: true},
    {useUnifiedTopology: true})
//create schema
const notesSchema ={
    title: String,
    content: String,
    type: String,
    data: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
}
const Note =mongoose.model('Note',notesSchema);

app.get('/index', (req, res) => {
    res.render('pages/index');
})

app.get('/about', ((req, res) => {
    res.render('pages/about');
}))
app.get('/cyber', ((req, res) => {
    res.render('pages/cyber');
}))
app.get('/csgo', ((req, res) => {
    res.render('pages/csgo');
}))
app.get('/new', ((req, res) => {
    res.sendFile(__dirname+ '/views/pages/new.html');
}))
app.get('/sport', (req, res) => {

    Note.find({},function (err, notes) {
        res.render('pages/sport', {
            notesList: notes
        })
    })
})


app.post('/new', function (req,res){
    let newNote = new Note({
        title: req.body.title,
        type: req.body.type,
        data: req.body.data,
        content: req.body.content,
        createdAt: new Date()
    })
    newNote.save();
    res.redirect('/sport');
})


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


const PORT = process.env.PORT || 6969;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});

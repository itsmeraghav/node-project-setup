var http = require('http'),
  path = require('path'),
  methods = require('methods'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  passport = require('passport'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';
// require('dotenv').config();
require('dotenv').config({ path: '.env' });
// Create global app object
var app = express();
app.use(
  express.urlencoded({ extended: true })
);
  
app.use(express.json());
// var originsWhitelist = [
//   'http://localhost:4000',
//   'http://localhost:4000',
//   'http://localhost:4000',
//   'http://localhost:4000',
// ];
// var corsOptions = {
//   origin: function (origin, callback) {
//     var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//     callback(null, isWhitelisted);
//   },
//   credentials: true
// }
app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '500mb' }));

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'PMTC', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.DATABASE_URL_PRODUCTION);
  
} else { 
  
  mongoose.connect(process.env.DATABASE_URL_DEVELOPMENT);
  mongoose.set('debug', true);
}


require('./models');   
require('./config/passport');   
 

var server = app.listen(process.env.PORT || 4000, function () {
  console.log('Listening on port ' + server.address().port);
});

// var io = require('socket.io').listen(server, {
//   handlePreflightRequest: false
// });

app.use(require('./routes')());


// app.get("/", (req, res) => {
// 	return res.json({ user: "user.toAuthJSON()" });
// })
/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(express.static(path.join(__dirname, 'uploads')));
/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

app.use('*', (req, res, next) => {
  if (req.method == "OPTIONS") {
    console.log('!OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    // set header to handle the CORS
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With';
    headers['Access-Contrl-Allow-Methods'] = 'PUT, POST, GET, DELETE, OPTIONS';
    headers["Access-Control-Max-Age"] = '86400';
    res.writeHead(200, headers);


    res.end();
  } else {
    next();
  }
});

app.use(function (req, res, next) {
  if (req.user.role === 'admin') {
    req.user.perms = req.session.user;
  } else {
    req.user.perms = req.session.user;
  }
  next();
})
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {

  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});
 

//app.io = io;
// app.on('connection', function (socket) {
//   console.log("Connected to Socket!! " + socket.id);
// });

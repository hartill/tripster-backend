var createError = require('http-errors');
const express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
// database connection
var connection = require('./connection');
const fileUpload = require('express-fileupload');
const session = require("express-session");
const fs = require('fs');
// generate random uuids
const uuid = require('uuid/v4');
// store text files
const FileStore = require('session-file-store')(session);
// hashed passwords
const bcrypt = require('bcrypt-nodejs');
// import routes
const routes = require('./routes')

// create the server
var app = express();

// passport for authentication
const passport = require('passport');
// local strategy = username and password login
const LocalStrategy = require('passport-local').Strategy;

// set resources to allow cross origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Allow serving of static files from the server
app.use(express.static('public'));

// For image uploading
app.use(fileUpload());

// view engine setup - i think this is not used
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  genid: (req) => {
    // use UUIDs for session IDs
    return uuid();
  },
  store: new FileStore(),
  secret: 'asdf33g4w4hghjkuil8saef345',
  resave: true,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// Get routes
app.get('/albums', routes.getAlbums);
app.get('/location/:id', routes.getLocation);
app.get('/album/:id', routes.getSingleAlbum);
app.get('/image/:id', routes.getImage);
app.get('/album-images/:id', routes.getAlbumImages);
app.get('/image-location/:id', routes.getImageLocation);
app.get('/album-location/:id', routes.getAlbumLocationIds);
app.get('/get-location-by-coords/?', routes.getLocationByCoords);

// Delete routes
app.delete('/remove-image/:id', ensureAuthenticated, routes.deleteImage);
app.delete('/delete-album/:id', ensureAuthenticated, routes.deleteAlbum);
app.delete('/delete-album-location-connection/?', ensureAuthenticated, routes.deleteAlbumLocationConnection);

// Post routes
app.post('/update-featured-image/?', ensureAuthenticated, routes.updateFeaturedImage);
app.post('/update-album', ensureAuthenticated, routes.updateAlbum);
app.post('/new-album', ensureAuthenticated, routes.postNewAlbum);
app.post('/new-location', ensureAuthenticated, routes.postNewLocation);
app.post('/new-album-to-location', ensureAuthenticated, routes.postNewAlbumToLocation);
app.post('/update-image-location/?', ensureAuthenticated, routes.updateImageLocation);
app.post('/upload-image', ensureAuthenticated, routes.postNewImage);

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    connection.query(
      'SELECT * FROM users WHERE user_name = ? LIMIT 1',
      [username],
      function(err, rows){
        var user = rows[0];
        if (!user) {
          return done(null, false, { message: 'Invalid credentials.\n' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Invalid credentials.\n' });
        }
        return done(null, user);
      }
    );
  }
));

// serialization (part of authentication)
passport.serializeUser((user, done) => {
  return done(null, user.id);
});

// deserialize (part of authentication)
passport.deserializeUser((id, done) => {
  connection.query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [id],
    function(err, rows) {
      if(err) {
        console.log(err)
      }
      return done(err, rows[0]);
    }
  );
});

// connect to the database
connection.connect(function(err, result) {
  if (err) throw err
  console.log('You are now connected...')
})

// handle login post
app.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    var userInfo = {
      id: req.user.id,
      username: req.user.user_name
    }
    return res.send(userInfo)
  }
);

// handle logout get
app.get('/logout', function(req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

// Check user is authenticated before calling next
function ensureAuthenticated(req, res, next) {
  console.log('CHECKING AUTHENTICATION: ' + req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next();
  }
}

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql')
var connection = require('./connection');
const fileUpload = require('express-fileupload');
const fs = require('fs')

routes = require('./routes')

var app = express();

connection.connect(function(err, result) {
  if (err) throw err
  console.log('You are now connected...')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
app.use(fileUpload());

app.get('/albums', routes.getAlbums);
app.get('/location/:id', routes.getLocation);
app.get('/album/:id', routes.getSingleAlbum);
app.get('/image/:id', routes.getImage);
app.get('/album-images/:id', routes.getAlbumImages);
app.get('/image-location/:id', routes.getImageLocation);
app.get('/album-location/:id', routes.getAlbumLocationIds);
app.get('/get-location-by-coords', routes.getLocationByCoords);

app.delete('/remove-image/:id', routes.deleteImage);
app.delete('/delete-album/:id', routes.deleteAlbum);

app.post('/update-featured-image/:id', routes.postFeaturedImage);
app.post('/update-album', routes.updateAlbum);
app.post('/new-album', routes.postNewAlbum);
app.post('/new-location', routes.postNewLocation);
app.post('/new-album-to-location', routes.postNewAlbumToLocation);
app.post('/upload-image', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  let locationId = req.body.location_id
  let albumId = req.body.album_id
  let dir = './public/images/' + albumId + '/'

  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
  }

  let file = req.files.file
  let fileName = file.name
  let filePath = dir + fileName

  // place the file on the server if it doesn't already exist
  if (!fs.existsSync(filePath)) {
    file.mv(filePath, function(err, result) {
      if (err)
        return res.status(500).send(err)

      //res.send(JSON.stringify(result))
    })
  } else {
    return res.status(400).send('File with same name already exists.');
  }

  let value = [fileName, albumId, locationId]
  connection.query('INSERT INTO images (file_name, album_id, location_id) VALUES (?, ?, ?)', value, function (err, result) {
          if (err) throw err;
          res.send(JSON.stringify(result))
      }
  );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

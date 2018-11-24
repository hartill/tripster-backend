var connection = require('../connection');
const fs = require('fs');

/*exports.getLocationData = function(req, res) {
  connection.query(
    'SELECT * FROM locations INNER JOIN ALbumsLocations ON AlbumsLocations.location_id = locations.id AND AlbumsLocations.album_id = ?',
    [req.params.id], function (err, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) throw err
    res.send(JSON.stringify(results));
    console.log(results)
  });
}*/

exports.getLocation = function(req, res) {
  connection.query(
    'SELECT * FROM locations WHERE id = ? LIMIT 1',
    [req.params.id], function (err, results, fields) {
    if (err) throw err
    res.send(JSON.stringify(results));
    console.log(results)
  });
}

exports.getImage = function(req, res) {
  connection.query(
    'SELECT * FROM images WHERE id = ? LIMIT 1',
    [req.params.id], function (err, results, fields) {
    if (err) throw err
    res.send(JSON.stringify(results));
    console.log(results)
  });
}

exports.getImageLocation = function(req, res) {
  connection.query(
    'SELECT * FROM locations WHERE id = ?',
    [req.params.id], function (err, results, fields) {
    if (err) throw err
    res.send(JSON.stringify(results));
    console.log(results)
  });
}

exports.getAlbumLocationIds = function(req, res) {
  let locations = []
  connection.query('SELECT location_id FROM albumsLocations WHERE album_id = ?',[req.params.id], function (err, results, fields) {
    if (err) throw err
    res.send(JSON.stringify(results));
  });
}

exports.getSingleAlbum = function(req, res) {
  connection.query('SELECT * FROM albums WHERE id = ?',[req.params.id], function (err, results, fields) {
    if (err) throw err
    res.send(JSON.stringify(results));
    console.log(results)
  });
}

exports.getAlbumImages = function(req, res) {
  connection.query('SELECT * FROM images WHERE album_id = ?',[req.params.id], function (err, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) throw err
    res.send(JSON.stringify(results));
    console.log(results)
  });
}

exports.getAlbums = function(req, res) {
  connection.query('SELECT * FROM albums', function (err, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) throw err
    res.send(JSON.stringify(results));
  });
}

exports.postNewAlbum = function(req, res) {
  connection.query('INSERT INTO albums (name, start_date, end_date, featured_image_id) VALUES (?, ?, ?, ?)', req.body, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.getLocationByName = function(req, res) {
  connection.query('SELECT id FROM locations WHERE name = ? LIMIT 1', req.body, function (err, results, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
}

exports.postNewLocation = function(req, res) {
  connection.query('INSERT INTO locations (lat, lng, name) VALUES (?, ?, ?)', req.body, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.postNewAlbumToLocation = function(req, res) {
  connection.query('INSERT INTO albumsLocations (album_id, location_id) VALUES (?, ?)', req.body, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.postFeaturedImage = function(req, res) {
  let albumId = req.params.id
  let imageId = req.body[0]
  let values = [imageId, albumId]
  console.log(albumId, imageId)
  connection.query('UPDATE albums SET featured_image_id = ? WHERE id = ?', values, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.updateAlbum = function(req, res) {
  console.log(req.body)
  connection.query('UPDATE albums SET name = ?, start_date = ?, end_date = ?, featured_image_id = ? WHERE id = ?', req.body, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.deleteAlbum = function(req, res) {
  connection.query('DELETE FROM albums WHERE id = ? LIMIT 1', [req.params.id], function (err, result) {
          if (err) throw err;
          connection.query('DELETE FROM albumsLocations WHERE album_id = ?', [req.params.id], function (err, result) {
                  if (err) throw err;
                  res.send(result);
              }
          );
      }
  );
}

exports.deleteImage = function(req, res) {
  let fileName = null
  let albumId = null
  let dir = './public/images/'
  connection.query('SELECT file_name, album_id FROM images WHERE id = ? LIMIT 1',[req.params.id], function (err, results, fields) {
    if (err) throw err
    console.log(results)
    fileName = results[0].file_name
    albumId = results[0].album_id

    let imagePath = dir + albumId + '/' + fileName
    console.log(imagePath)

    if(fileName) {
      fs.unlink(imagePath, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');

        connection.query('DELETE FROM images WHERE id = ? LIMIT 1', [req.params.id], function (err, result) {
                if (err) throw err;
                res.send(result);
            }
        );
      });
    }
  });
}

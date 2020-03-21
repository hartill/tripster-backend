var connection = require('../connection');
const fs = require('fs');

exports.getLocation = function(req, res) {
  connection.query(
    'SELECT * FROM locations WHERE id = ? LIMIT 1',
    [req.params.id], function (err, results, fields) {
    if (err) throw err
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.send(JSON.stringify(results));
  });
}

exports.getImage = function(req, res) {
  connection.query(
    'SELECT * FROM images WHERE id = ? LIMIT 1',
    [req.params.id], function (err, results, fields) {
    if (err) throw err
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.send(JSON.stringify(results));
  });
}

exports.getImageLocation = function(req, res) {
  connection.query(
    'SELECT * FROM locations WHERE id = ?',
    [req.params.id], function (err, results, fields) {
    if (err) throw err
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.send(JSON.stringify(results));
  });
}

exports.getAlbumLocationIds = function(req, res) {
  let locations = []
  connection.query('SELECT location_id FROM albumsLocations WHERE album_id = ?',[req.params.id], function (err, results, fields) {
    if (err) throw err
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.send(JSON.stringify(results));
  });
}

exports.getSingleAlbum = function(req, res) {
  connection.query('SELECT * FROM albums WHERE id = ?',[req.params.id], function (err, results, fields) {
    if (err) throw err
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.send(JSON.stringify(results));
  });
}

exports.getAlbumImages = function(req, res) {
  connection.query('SELECT * FROM images WHERE album_id = ?',[req.params.id], function (err, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) throw err
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.send(JSON.stringify(results));
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


exports.getLocationByCoords = function(req, res) {
  let query = [req.query.lat, req.query.lng]
  connection.query('SELECT id FROM locations WHERE lat = ? AND lng = ? LIMIT 1', query, function (err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
}

exports.postNewAlbum = function(req, res) {
  connection.query('INSERT INTO albums (name, slug, start_date, end_date, featured_image_id) VALUES (?, ?, ?, ?, ?)', req.body, function (err, result) {
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

exports.updateFeaturedImage = function(req, res) {
  let query = [req.query.image_id, req.query.album_id]
  connection.query('UPDATE albums SET featured_image_id = ? WHERE id = ?', query, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.updateImageLocation = function(req, res) {
  let query = [req.query.location_id, req.query.image_id]
  connection.query('UPDATE images SET location_id = ? WHERE id = ?', query, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.updateAlbum = function(req, res) {
  // to... this is bad practice
  let originalAlbumSlug = req.body[6]
  let newAlbumSlug = req.body[1]

  // if the slug has changed we need to rename the folder
  if(newAlbumSlug !== originalAlbumSlug) {
    console.log('renaming: ' + originalAlbumSlug + ' to: ' + newAlbumSlug)

    let newFolderPath = './public/images/' + newAlbumSlug

    // if the folder path already exists return error
    if (fs.existsSync(newFolderPath)) {
      return res.status(400).send('Folder with same name already exists.');
    }

    // rename the old folder to new folder
    fs.rename('./public/images/' + originalAlbumSlug, './public/images/' + newAlbumSlug, function (err) {
      // return on any error
      if (err)
        return res.status(500).send(err)
    });
  }

  // now update the database with new album info
  connection.query('UPDATE albums SET name = ?, slug = ?, start_date = ?, end_date = ?, featured_image_id = ? WHERE id = ?', req.body, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
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

exports.deleteAlbumLocationConnection = function(req, res) {
  let query = [req.query.album_id, req.query.location_id]
  console.log(query)
  connection.query('DELETE FROM albumsLocations WHERE album_id = ? AND location_id = ? LIMIT 1', query, function (err, result) {
          if (err) throw err;
          res.send(result);
      }
  );
}

exports.postNewImage = function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // get the album name to use as folder name
  connection.query('SELECT slug FROM albums WHERE id = ?', [req.body.album_id], function (err, results, fields) {
    if (err) throw err
    // we return one result, the album slug
    let albumSlug = results[0].slug
    console.log(albumSlug)

    let locationId = req.body.location_id
    let orientation = req.body.orientation
    if (!orientation || isNaN(orientation - parseFloat(orientation)) || orientation < 1 || orientation > 8) {
      orientation = 1
    }
    let albumId = req.body.album_id
    let width = req.body.width
    let height = req.body.height
    let file_size = req.body.file_size
    let last_modified = req.body.last_modified

    let dir = './public/images/' + albumSlug + '/'

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

    let value = [fileName, width, height, orientation, file_size, last_modified, albumId, locationId]
    connection.query('INSERT INTO images (file_name, width, height, orientation, file_size, last_modified, album_id, location_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', value, function (err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result))
        }
    );
  });
}

exports.deleteImage = function(req, res) {
  let fileName = null
  let albumId = null
  let dir = './public/images/'
  connection.query('SELECT file_name, album_id FROM images WHERE id = ? LIMIT 1',[req.params.id], function (err, results, fields) {
    if (err) throw err
    fileName = results[0].file_name
    albumId = results[0].album_id

    if(albumId) {
      // get the album folder slug
      connection.query('SELECT slug FROM albums WHERE id = ?', [albumId], function (err, results, fields) {

        let albumSlug = results[0].slug

        let imagePath = dir + albumSlug + '/' + fileName

        if(fileName) {
          fs.unlink(imagePath, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');

            connection.query('DELETE FROM images WHERE id = ? LIMIT 1', [req.params.id], function (err, result) {
              if (err) throw err;
              res.send(result);
            });
          });
        }
      })
    }
  });
}

var connection = require('../connection');

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

exports.getLocationData = function(req, res) {
  connection.query(
    'SELECT * FROM locations WHERE album_id = ?',
    [req.params.id], function (err, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
    if (err) throw err
    res.send(JSON.stringify(results));
    console.log(results)
  });
}

exports.getSingleAlbum = function(req, res) {
  connection.query('SELECT * FROM albums WHERE id = ?',[req.params.id], function (err, results, fields) {
    // error will be an Error if one occurred during the query
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
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
  connection.query('INSERT INTO albums (name, start_date, end_date, featured_image) VALUES (?, ?, ?, ?)', req.body, function (err, result) {
          if (err) throw err;
          res.send(JSON.stringify(result))
      }
  );
}

exports.postNewLocation = function(req, res) {
  connection.query('INSERT INTO locations (lat, lng, name, album_id) VALUES ?', [req.body], function (err, result) {
          if (err) throw err;
          res.send('Location added to database with ID: ' + result.insertId);
      }
  );
}

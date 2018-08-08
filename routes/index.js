var connection = require('../connection');

exports.getLocationData = function(req, res) {
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
    console.log(results)
  });
  /*
  res.json(
    [
      {
        id: 0,
        tripTitle: 'Traveling along the north Coast of Spain',
        tripStartDate: 1466028000000,
        tripEndDate: 1469138400000,
        mainDestinations: [
          'Spain',
          'France'
        ],
        featureImage: 'static/images/placeholder-5.jpg',
        locations: [
          {
            name: 'San Sebastian',
            lat: 43.318334,
            lng: -1.981231,
            images: [
              'static/images/placeholder-1.jpg',
              'static/images/placeholder-2.png'
            ]
          },
          {
            name: 'Pamplona',
            lat: 42.812526,
            lng: -1.645775,
            images: [
              'static/images/placeholder-3.jpg',
              'static/images/placeholder-4.jpg'
            ]
          },
          {
            name: 'Biaritz',
            lat: 43.483152,
            lng: -1.558626,
            images: [
              'static/images/placeholder-5.jpg',
              'static/images/placeholder-6.jpg'
            ]
          }
        ]
      },
      {
        id: 1,
        tripTitle: 'Surfing in Indonesia',
        tripStartDate: 1502488800000,
        tripEndDate: 1505858400000,
        mainDestinations: [
          'Indonesia'
        ],
        featureImage: 'static/images/placeholder-3.jpg',
        locations: [
          {
            name: 'Padang Padang',
            lat: -8.811138,
            lng: 115.103766,
            images: [
              'static/images/placeholder-1.jpg',
              'static/images/placeholder-2.png'
            ]
          },
          {
            name: 'Uluwatu',
            lat: -8.829143,
            lng: 115.084907,
            images: [
              'static/images/placeholder-3.jpg',
              'static/images/placeholder-4.jpg'
            ]
          },
          {
            name: 'Kuta, Lombok',
            lat: -8.880274,
            lng: 116.283612,
            images: [
              'static/images/placeholder-5.jpg',
              'static/images/placeholder-6.jpg'
            ]
          }
        ]
      },
      {
        id: 2,
        tripTitle: 'Another trip',
        tripStartDate: 1502488800000,
        tripEndDate: 1505858400000,
        mainDestinations: [
          'Nicaragua'
        ],
        featureImage: 'static/images/2/placeholder-1.jpg',
        locations: [
          {
            name: 'San Juan Del Sur',
            lat: 11.263406,
            lng: -85.863977,
            images: [
              'static/images/2/placeholder-1.jpg',
              'static/images/2/placeholder-2.jpg',
              'static/images/2/placeholder-8.jpg'
            ]
          },
          {
            name: 'Popoyo',
            lat: 11.470099,
            lng: -86.124925,
            images: [
              'static/images/2/placeholder-3.jpg',
              'static/images/2/placeholder-4.jpg',
              'static/images/2/placeholder-7.jpg'
            ]
          },
          {
            name: 'Managua',
            lat: 12.114993,
            lng: -86.236174,
            images: [
              'static/images/2/placeholder-5.jpg',
              'static/images/2/placeholder-6.jpg'
            ]
          }
        ]
      },
    ]
  ); */
}

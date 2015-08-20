var fs = require('fs');
var webshot = require('webshot');
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var Q = require('q')

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use('/screens', express.static('screens'));

router.get('/', function( req, res ) {

  res.render('index', {
    query: req.query.url || '',
    width: req.query.width || '',
    height: req.query.height || '',
    urls: [],
    files: []
  });

});

var parseURLS = function(urls, width, height) {
  var deferred = Q.defer();
  var files = [];
  _.each(urls, function(url, key) {
    var name = url.split('.in').toString().split('.com')[0];
    var fileName = './screens/' + name + '.png';
    var options = {
      screenSize: {
        width: width,
        height: height
      }
    }
    console.log('getting screen', url, name, key, options);
    webshot('http://' + url, fileName, options, function() {
      files.push(fileName.replace('.', ''));
      if (key === (files.length - 1)) {
        deferred.resolve(files);
      }
    });
  });

  return deferred.promise;
}

router.get('/grab', function(req,res) {
  res.redirect('/');
});

router.post('/grab', function(req, res, next) {
  var query = req.query;
  var width = req.body.width || 1024;
  var height = req.body.height || 768;

  if (req.body.urls) {

    Q.when(parseURLS(req.body.urls, width, height)).done(function(files) {
      console.log('done');
      res.render('index', {
        urls: req.body.urls,
        width: width,
        height: height,
        files: files ? files : []
      });
    });
  }

});

app.use('/', router);

// console.log(process.env.URL, process.env.WIDTH, process.env.HEIGHT);

// webshot('google.com', 'google.png', function(err) {
//   if (err) { console.log('error', err); }
// });

var port = process.env.PORT || 2001;

if(!process.env.URL) {
  console.log('listening on ' + port);
  app.listen(port);
}
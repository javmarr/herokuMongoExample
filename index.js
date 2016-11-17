var cool = require('cool-ascii-faces');
var express = require('express');

var mongoose = require('mongoose');


const MONGOLAB_URI = process.env.MONGOLAB_URI;
if (MONGOLAB_URI) {
  mongoose.connect(MONGOLAB_URI);
} else {
  mongoose.connect('mongodb://localhost/testing');
}

var songSchema = mongoose.Schema({
  song: String,
  start: {type: Number, default:0},
  weeksAtOne: Number
});


// console.log("the value for times: " + test);
var Song = mongoose.model('songs', songSchema);


var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/songList', function(request, response) {
  Song.find({}, function(err, docs) {
    if (err) response.send(err);
    else response.send(docs);
  });
});

app.get('/song/:songName', function(request, response) {
  var songName = request.params.songName;

  var newSong = new Song({
    song: songName,
    stars: 5,
    weeksAtOne: 2
  });
  newSong.save();

  response.redirect('/songList');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

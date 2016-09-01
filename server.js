var express = require('express');
var app = express();

// Listen to port 80 http port
app.listen(80, function () {
  console.log('Listening for connections');
});

// Host the public folder app
app.use(express.static('app'));

var apoc = require('apoc');

apoc.query('match (n) return n').exec().then(
  function (response) {
    console.log(response);
  },
  function (fail) {
    console.log(fail);
  }
);
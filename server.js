var express = require('express');
var app = express();

// Listen to port 80 http port
app.listen(80, function () {
  console.log('Listening for connections');
});

// Host the public folder app
app.use(express.static('app'));

/*
var neo4j = require('neo4j-driver').v1;

app.get('/getRecipe', function (req, res, next) {
  var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "foodstuff"));
  var session = driver.session();
  session.run("START a=node(60) MATCH (a)-[r:DEPENDS*]->(d) RETURN DISTINCT r")
    .then(function (result) {
      
      for (var i = 0; i < result.records.length; i++) {
console.log("here");
        console.log(result.records[i].get("procedure"));
      }
      session.close();
      driver.close();
      res.json(result);
    });
});*/
/*
var Neo4j = require("simple-neo4j");

var neo4j = new Neo4j();
app.get('/getRecipe', function (req, res, next) {
  neo4j.addQuery('MATCH (n) RETURN n').then(function (result) {
    console.log(result);
    res.json(result);
  });
});
*/

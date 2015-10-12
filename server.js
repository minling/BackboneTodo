var express = require('express');
var Parse = require('parse/node').Parse;
Parse.initialize("G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN", "5P3GTnoyFwx8sPu9YT5sP7vl3aAtH1xN8l6T6MVB");
var app = express();

app.use(express.static(__dirname + '/public'));

//ROUTES 
//does not work right now because i'm not actually getting anything from api/todos
app.get('api/todos', function(req, res) {
  Todo.find(function(err, docs) {
    docs.forEach(function(item) {
      console.log('Received a GET request for _id:' +item._id);
    })
    res.send(docs);
  })
})
var port = 3000;

app.listen(port);
console.log('server on ' + port);


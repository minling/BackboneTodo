var express = require('express');
var Parse = require('parse/node').Parse;
Parse.initialize("G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN", "5P3GTnoyFwx8sPu9YT5sP7vl3aAtH1xN8l6T6MVB");
var app = express();


app.use(express.static(__dirname + '/public'));

var port = 3000;

app.listen(port);
console.log('server on ' + port);


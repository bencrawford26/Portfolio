var express = require('express');  
var request = require('request');
var cors = require('cors')
var app = express()
 
app.use(cors())

app.use('/', function(req, res) {  
  var url = 'https://gcu.ideagen-development.com' + req.url;
  console.log(url);
  req.pipe(request(url)).pipe(res);
});

app.listen(process.env.PORT || 3000);  

console.log('Server running on port 3000');
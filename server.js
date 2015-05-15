var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/api', function (req, res) {
  res.json({ message: "You are running dangerously low on beer!" });
});

app.listen(port, function(){
  console.log('Server start http://localhost:' + port);
});
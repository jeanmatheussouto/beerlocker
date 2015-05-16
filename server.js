var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParse = require('body-parser');
var router = express.Router();

var Beer = require('./models/beer');

mongoose.connect('mongodb://localhost:27017/beerlocker');

app.use(bodyParse.urlencoded({
  extended: true
}));
app.use(morgan('dev')); // log requests

// GET /api
router.get('/', function (req, res) {
  res.json({ message: "Status: OK" });
});

var beerRouter = router.route('/beers');

// POST /api/beer
beerRouter.post(function(req, res){
  var beer = new Beer(req.body);

  beer.save(function(err){
    if (err) { res.send(err); }
    res.json({ message: 'Beer added to the locker!', data: beer });
  });
});

// GET /api/beers
beerRouter.get(function(req, res) {
  Beer.find(function(err, beers) {
    if (err) { res.send(err); }
    res.json(beers);
  });
});

// GET /api/beers/:beer_id
var beerRoute = router.route('/beers/:beer_id');

beerRoute.get(function(req, res){
  var beer_id = req.params.beer_id;
  Beer.findById(beer_id, function(err, beer){
    if (err) { res.send(err);}
    if (beer === null) { 
      res.json({ message: 'Beer not found!'}); 
    } else {
      res.json(beer);
    }
  });
});

// PUT /api/beers/:beer_id
beerRoute.put(function(req, res){
  var beer_id = req.params.beer_id;
  Beer.findById(beer_id, function(err, beer){
    beer.quantity = req.body.quantity;

    beer.save(function(err){
      if (err) { res.send(err); }
      res.json(beer);
    });
  });
});

// DELETE /api/beers/:beer_id
beerRoute.delete(function(req, res){
  var beer_id = req.params.beer_id;
  Beer.findByIdAndRemove(beer_id, function(err){
    if (err) { res.send(err); }
    res.json({ message: 'Beer removed from the locker!' } );
  });
});

app.use('/api', router);

app.listen(port, function(){
  console.log('Server start http://localhost:' + port);
});
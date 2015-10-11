var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var tabledata = [
    { 
      seq: 1
      , name: "First Item"
      , dateAdded: "2015-07-10"
      , currentCount: 2
      , desiredCount: 5
      , difference: 2-5
      , differencePercentage: 2/5
      , itemValue: 30 //$
      , totalValue: 60
    },
    { 
      seq: 2
      , name: "Second Item"
      , dateAdded: "2015-07-11"
      , currentCount: 3
      , desiredCount: 2
      , difference: 3-2
      , differencePercentage: 3/2
      , itemValue: 102 //$
      , totalValue: 306
    },
  ]
  res.render('index', { title: 'Fluffy', tabledata: tabledata});
});

module.exports = router;

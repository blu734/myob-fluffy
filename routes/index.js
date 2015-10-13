var express = require('express');
var router = express.Router();
var db = require('../lib/dbmongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  //var tabledata = [
  //  {
  //    seq: 1
  //    , name: "First Item"
  //    , dateAdded: "2015-07-10"
  //    , currentCount: 2
  //    , desiredCount: 5
  //    , difference: 2-5
  //    , differencePercentage: 2/5
  //    , itemValue: 30 //$
  //    , totalValue: 60
  //  },
  //  {
  //    seq: 2
  //    , name: "Second Item"
  //    , dateAdded: "2015-07-11"
  //    , currentCount: 3
  //    , desiredCount: 2
  //    , difference: 3-2
  //    , differencePercentage: 3/2
  //    , itemValue: 102 //$
  //    , totalValue: 306
  //  },
  //]
  var run = function(data) {
    console.log(data);
    res.render('index', { title: 'Fluffy', tabledata: data });
  }
  var schema = {
    itemName: {$exists:true}
  , inv: {$elemMatch: {
      date: {$exists:true}
    , currentCount: {$exists:true}
    , desiredCount: {$exists:true}
    }}
  , itemValue: {$exists:true}
  };
  
  db.getInventory(run,schema);
});
//router.get('/getinventory', function(req, res, next) {
//  var run = function(data) {
//    res.send({title:"Get Inventory", data:data});
//  }
//  var schema = {
//    itemName: {$exists:true}
//  , inv: {$exists:true,$elemMatch: {
//      date: {$exists:true}
//    , currentCount: {$exists:true}
//    , desiredCount: {$exists:true}
//    }}
//  , itemValue: {$exists:true}
//  };
//  
//  db.getInventory(run,schema);
//});
router.post('/addinventory', function(req, res, next) {
  var itemName = req.body.itemName;
  var currentCount = req.body.currentCount;
  var desiredCount = req.body.desiredCount;
  var itemValue = req.body.itemValue;
  if (!(itemName && currentCount && desiredCount && itemValue)){
    res.status(400);
    res.send({err:'Fields were null'});
    return;
  }
  var run = function(data) {
    res.send({title:"Add Inventory", data:data});
  }
  var obj = {
    itemName: itemName
  , inv: [{
      date: new Date()
    , currentCount: currentCount
    , desiredCount: desiredCount
    }]
  , itemValue: itemValue
  }
  
  db.addInventory(run,obj);
});
router.post('/updateinventory', function(req, res, next) {
  var id = req.body.id;
  var itemName = req.body.itemName;
  var currentCount = req.body.currentCount;
  var desiredCount = req.body.desiredCount;
  var itemValue = req.body.itemValue;
  if (!(id && itemName && currentCount && desiredCount && itemValue)){
    res.status(400);
    res.send({err:'Fields were null'});
    return;
  }
  var run = function(data) {
    res.send({title:"Update Inventory", data:data});
  }
  var obj = {
    id: id
  , data: {
      itemName: itemName
    , date: new Date()
    , currentCount: currentCount
    , desiredCount: desiredCount
    , itemValue: itemValue
    }
  }
  
  db.updateInventory(run,obj);
})
router.post('/deleteinventory', function(req, res, next) {
  var id = req.body.id;
  if (!id){
    res.status(400);
    res.send({err:'Fields were null'});
    return;
  }
  var run = function(data) {
    res.send({title:"Delete Inventory", data: data});
  }
  var obj = {
    id: id
  }
  
  db.deleteInventory(run,obj);
})

module.exports = router;

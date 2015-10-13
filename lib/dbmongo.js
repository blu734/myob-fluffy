var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
  , ObjectID = mongodb.ObjectID
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myob';
module.exports = {
  connect: function(query,res){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");

      query(db,res)
    });
  },
  insertOne: function(col, obj, render) {
    // Insert a single document
    col.insertOne(obj, render);
  },
  insertMany: function(col) {
    this.connect();

    // Insert multiple documents
    col.insertMany([{a:2}, {a:3}], function(err, r) {
      assert.equal(null, err);
      assert.equal(2, r.insertedCount);

      db.close();
    });
  },
  select: function(col, condition, render) {
    col.find(condition).toArray(render);
  },
  getInventory: function(res,condition){
    var select = this.select;
    var query = function(db,res) {
      select(db.collection('inventory'),condition,function(err, docs){
        assert.equal(null, err);
        //assert.equal(2, docs.length);
        db.close();
        res(docs);
      });
    }
    this.connect(query,res);
  },
  addInventory: function(run,obj){
    var insert = this.insertOne;
    var query = function(db,res) {
      insert(db.collection('inventory'), obj, function(err, r){
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        db.close();
        res({response:r,id:r.insertedId});
      })
    }
    this.connect(query,run);
  },
  updateInventory: function(run,obj){
    var query = function(db,res) {
      var col = db.collection('inventory');
      var set = {itemName:obj.itemName, itemValue: obj.itemValue};
      var push = {
        inv: {
          date:obj.date, currentCount:obj.currentCount, desiredCount: obj.desiredCount
        }
      };
      col.updateOne({_id:obj.id}, {$set: set, $push: push}, {
        upsert: true
      }, function(err, r) {
        assert.equal(null, err);
        db.close();
        res(r);
      });
    }
    this.connect(query,run)
  },
  deleteInventory: function(run,obj){
    var query = function(db,res) {
      var col = db.collection('inventory');
      console.log({_id:obj.id})
      col.deleteOne({_id:ObjectID(obj.id)}, function(err, r) {
        assert.equal(null, err);
        //assert.equal(1, r.deletedCount);
        //console.log(r);
        db.close();
        res({response:r, id: obj.id});
      });
    }
    this.connect(query,run)
  }
}

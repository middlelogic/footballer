// Model
Pick = function(doc) {
  _.extend(this, doc);
};

// Collection
Picks = new Mongo.Collection("picks", {
  transform: function(doc) {
    return new Pick(doc);
  }
});

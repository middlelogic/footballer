// Model
Odd = function(doc) {
  _.extend(this, doc);
};

// Collection
Odds = new Mongo.Collection("odds", {
  transform: function(doc) {
    return new Odd(doc);
  }
});

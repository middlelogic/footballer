// Model
Game = function(doc) {
  _.extend(this, doc);
};

_.extend(Game.prototype, {
  // Returns all Picks
  getPicks: function() {
    console.log("eid:", this.eid);
    return Picks.findOne({ userId: Meteor.user()._id, gameId: this.eid });
  },
  // Checks for Picks
  hasPicks: function() {
    return this.getPicks().count() > 0;
  }
});

// Collection
Games = new Mongo.Collection("games", {
  transform: function(doc) {
    return new Game(doc);
  }
});

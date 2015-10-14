// Model
Pick = function(doc) {
  _.extend(this, doc);
};


_.extend(Pick.prototype, {
  // Get Game
  getGame: function() {
    return Games.findOne({ eid: parseInt(this.gameId) });
  },
  // Get the posted odds for this game
  getSpread: function() {
    return Odds.findOne({ gameId: this.gameId });
  },
  // Determine whether the pick is favored
  isFav: function(pick, odd) {
    return pick === odd ? true : false;
  },
  // Get the team code for the pick
  getPick: function() {
    var pick = Picks.findOne({ gameId: this.gameId, userId: this.userId });
    if(typeof pick !== 'undefined') {
      return pick.pick;
    }
    else {
      return null;
    }
  },
  isPickCorrect: function(winning, pick) {
    return winning === pick ? true : false;
  },
  // Determine who is currently winning
  getWinning: function(game, odds) {
    if(typeof odds !== 'undefined') {
      // If home is winning
      if (game.home.score > game.away.score) {
        // If home is favored
        if(this.isFav(game.home.code, odds.pick)) {
          // If home is winning with the spread
          return (game.home.score - Math.abs(odds.spread)) > game.away.score ? game.home.code : game.away.code;
        }
        // Home is not favored
        else {
          // If home is winning
          return game.home.score > game.away.score ? game.home.code : game.away.code;
        }
      } else if (game.away.score > game.home.score) {
        // If away is favored
        if(this.isFav(game.away.code, odds.pick)) {
          // If away is winning with the spread
          return (game.away.score - Math.abs(odds.spread)) > game.home.score ? game.away.code : game.home.code;
        }
        // Away is not favored
        else {
          // If away is winning
          return game.away.score > game.home.score ? game.away.code : game.home.code;
        }
      // Score is tied
      } else {
        // If home is favored
        if(this.isFav(game.home.code, odds.pick)) {
          return game.away.code;
        }
        // If away is favored
        else if(this.isFav(game.away.code, odds.pick)) {
          return game.home.code;
        }
        else {
          return null;
        }
      }
    } else {
      return null;
    }
  },
  // Pass object with pre-processed values
  getResult: function() {

      var odds = this.getSpread(),
          fav = typeof odds !== 'undefined' ? odds.pick : null,
          pick = typeof Meteor.user() !== 'undefined' ? this.getPick() : null,
          isFav = this.isFav(pick, fav),
          game = this.getGame(),
          winning = this.getWinning(game, odds),
          isPickCorrect = this.isPickCorrect(winning, pick);

      // console.log("Picks", "odds:", odds, "fav:", fav, "pick:", pick, "isFav:", isFav, "winning:", winning, "isPickCorrect:", isPickCorrect);

      return  {
        odds: odds,
        fav: fav,
        game: game,
        pick: pick,
        isFav: isFav,
        winning: winning,
        isPickCorrect: isPickCorrect
      };

  }
});

// Collection
Picks = new Mongo.Collection("picks", {
  transform: function(doc) {
    return new Pick(doc);
  }
});

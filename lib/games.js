// Model
Game = function(doc) {
  _.extend(this, doc);
};

_.extend(Game.prototype, {
  // Get the posted odds for this game
  getSpread: function() {
    return Odds.findOne({ gameId: this.eid.toString() });
  },
  // Determine whether the pick is favored
  isFav: function(pick, odd) {
    return pick === odd ? true : false;
  },
  // Get the team code for the pick
  getPick: function() {
    if(typeof Meteor.userId() !== null) {
      var pick = Picks.findOne({ gameId: this.eid.toString(), userId: Meteor.userId() });
      if(typeof pick !== 'undefined') {
        return pick.pick;
      }
      else {
        return null;
      }
    } else {
      return null;
    }
  },
  getStatus: function() {
    switch(this.status) {
      case '1' : return '1st Quarter'; break;
      case '2' : return '2nd Quarter'; break;
      case '3' : return '3rd Quarter'; break;
      case '4' : return '4th Quarter'; break;
      case 'F' : return 'Final'; break;
      case 'FO' : return 'Final (OT)'; break;
      case 'H' : return 'HalfTime'; break;
      case 'P' : return 'Pre-game'; break;
    }
  },
  isPickCorrect: function(winning, pick) {
    return winning === pick ? true : false;
  },
  // Determine who is currently winning
  getWinning: function(odds) {
    if(typeof odds !== 'undefined') {
      // If home is winning
      if (this.home.score > this.away.score) {
        // If home is favored
        if(this.isFav(this.home.code, odds.pick)) {
          // If home is winning with the spread
          return (this.home.score - Math.abs(odds.spread)) > this.away.score ? this.home.code : this.away.code;
        }
        // Home is not favored
        else {
          // If home is winning
          return this.home.score > this.away.score ? this.home.code : this.away.code;
        }
      } else if (this.away.score > this.home.score) {
        // If away is favored
        if(this.isFav(this.away.code, odds.pick)) {
          // If away is winning with the spread
          return (this.away.score - Math.abs(odds.spread)) > this.home.score ? this.away.code : this.home.code;
        }
        // Away is not favored
        else {
          // If away is winning
          return this.away.score > this.home.score ? this.away.code : this.home.code;
        }
      // Score is tied
      } else {
        // If home is favored
        if(this.isFav(this.home.code, odds.pick)) {
          return this.away.code;
        }
        // If away is favored
        else if(this.isFav(this.away.code, odds.pick)) {
          return this.home.code;
        }
        else {
          return null;
        }
      }
    } else {
      return null;
    }
  },
  checkForPreGame: function(value) {
    if(this.status !== 'P') {
      return value;
    } else {
      return false;
    }
  },
  // Pass object with pre-processed values
  getResult: function() {

      var odds = this.getSpread(),
          fav = typeof odds !== 'undefined' ? odds.pick : null,
          pick = typeof Meteor.user() !== 'undefined' ? this.getPick() : null,
          isFav = this.isFav(pick, fav),
          winning = this.getWinning(odds),
          isPickCorrect = this.isPickCorrect(winning, pick),
          status = this.getStatus();

      // console.log("Games", "odds:", odds, "fav:", fav, "pick:", pick, "isFav:", isFav, "winning:", winning, "isPickCorrect:", isPickCorrect, "status:", status);

      return  {
        odds: odds,
        fav: fav,
        pick: pick,
        isFav: isFav,
        winning: this.checkForPreGame(winning),
        isPickCorrect: this.checkForPreGame(isPickCorrect),
        status: status
      };

  }
});

// Collection
Games = new Mongo.Collection("games", {
  transform: function(doc) {
    return new Game(doc);
  }
});

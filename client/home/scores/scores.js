
  Template.mainContentScores.helpers({
    games: function() {
        var week = parseInt(Router.current().params.week);
        return Games.find({ week: week }, { sort: { eid: 1 }});
    },
    isPick: function(results, game, side) {
        return game[side].code === results.pick ? true : false;
    },
    isPickCorrect: function(result) {
      return result.isPickCorrect ? 'yellow' : 'empty yellow';
    },
    isWinning: function(game, side, result) {
      if(game[side].code === result.winning && game.status !== 'P') {
          return game[side].code === result.winning ? 'green' : 'red';
      } else if(game[side].code !== result.winning && game.status !== 'P') {
          return game[side].code === result.winning ? 'green' : 'red';
      } else {
          return 'black'
      }
    },
    getStatus: function(result) {
      return result.status;
    },
    getOdds: function(result) {
      if(typeof result.odds !== 'undefined') {
          return result.odds.pick + ' by ' + Math.abs(result.odds.spread);
      } else {
        return null;
      }
    },
    isRedZone: function(game) {
      return game.redZone === 1 ? true : false;
    }
  });

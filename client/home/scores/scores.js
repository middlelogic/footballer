
  Template.mainContentScores.helpers({
    games: function() {
        var week = parseInt(Router.current().params.week);
        return Games.find({ week: week }, { sort: { eid: 1 }});
    },
    scoreHomeClass: function(game) {

      var home = game.home.code,
          homeDiff = game.home.score - game.away.score,
          awayDiff = game.away.score - game.home.score,
          pick, spread,
          isFav = false;

      var odd = Odds.findOne({ gameId: game.eid.toString() });
      if(typeof odd !== 'undefined') {
        pick = odd.pick;
        spread = odd.spread;
        if(pick === home && spread < 0)
          isFav = true;
      }

      // If no score
      if(homeDiff === 0) { return ''; }
      // If winning
      else if (homeDiff > 0) {
        // Not favored
        if(!isFav) {
          return 'green';
        } else {
          // Covers the spread?
          if((game.home.score -  Math.abs(spread) - game.away.score) > 0) {
            return 'green';
          } else {
            return 'red';
          }
        }
      // if losing
    } else if (homeDiff < 0) {
        // Favored
        if(isFav) {
          return 'red';
        }
        // Not Favored
        else {
            // Covers the spread?
            if(game.home.score - (game.away.score - Math.abs(spread)) > 0) {
              return 'green';
            } else {
              return 'red';
            }
        }
      }
    },
    scoreAwayClass: function(game) {
      var away = game.away.code,
          homeDiff = game.home.score - game.away.score,
          awayDiff = game.away.score - game.home.score,
          pick, spread,
          isFav = false;

      var odd = Odds.findOne({ gameId: game.eid.toString() });
      if(typeof odd !== 'undefined') {
        pick = odd.pick;
        spread = odd.spread;
        if(pick === away && spread < 0)
          isFav = true;
      }

      // If no score
      if(awayDiff === 0) { return ''; }
      // If winning
      else if (awayDiff > 0) {
        // Not favored
        if(!isFav) {
          return 'green';
        } else {
          // Covers the spread?
          if((game.away.score -  Math.abs(spread) - game.home.score) > 0) {
            return 'green';
          } else {
            return 'red';
          }
        }
      // if losing
    } else if (awayDiff < 0) {
        // Favored
        if(isFav) {
          return 'red';
        }
        // Not Favored
        else {
            // Covers the spread?
            if(game.away.score - (game.home.score - Math.abs(spread)) > 0) {
              return 'green';
            } else {
              return 'red';
            }
        }
      }
    },
    getStatus: function(status) {
      var statusStr = '';
      switch(status) {
        case '1' : statusStr = '1st Quarter'; break;
        case '2' : statusStr = '2nd Quarter'; break;
        case '3' : statusStr = '3rd Quarter'; break;
        case '4' : statusStr = '4th Quarter'; break;
        case 'F' : statusStr = 'Final'; break;
        case 'FO' : statusStr = 'Final (OT)'; break;
        case 'H' : statusStr = 'HalfTime'; break;
        case 'P' : statusStr = 'Pre-game'; break;
      }
      return statusStr;
    },
    getOdds: function(game) {
      var odd = Odds.findOne({ gameId: game.eid.toString() });
      if(typeof odd !== 'undefined') {
        return odd.pick + ' must win by '+ Math.abs(odd.spread) +'';
      }
    },
    isRedZone: function(game) {
      return game.redZone === 1 ? true : false;
    }
  });


  Template.mainContentVersus.events({
    'click .showPicks': function(event) {
      var id = event.target.id;
      $('.ui.modal.modal-'+id)
      .modal('setting', 'transition', 'horizontal flip')
      .modal('show');
    }
  });

  Template.mainContentVersus.helpers({
    'users': function() {
      // Find other users
      var users = Meteor.users.find({}).fetch();

      if(typeof users !== 'undefined') {
        users.forEach(function(d) {
          d.name = d.profile["first-name"];
          d.color = d.profile["fav-color"];
        });
      }
      return users;
    },
    'properName': function(name) {
      var lastChar = name.slice(-1);
      return lastChar === 's' ? name+'\'' : name + '\'s';
    },
    'picks': function(userId) {
      var week = typeof Router.current().params.week !== 'undefined' ? parseInt(Router.current().params.week) : Session.get('week');
      return Picks.find({ week: week, userId: userId }, { sort: { gameId: 1 } });
    },
    getName: function(pick, result) {
      return pick.pick === result.game.home.code ? result.game.home.name + ' (' + result.game.home.code + ')' : result.game.away.name + ' (' + result.game.away.code + ')';
    },
    getUserId: function(picks) {
      picks.forEach(function(d, i) {
        var userId = d.getUserId();
        if(i === 1) {
          return userId;
        }
      });
    },
    getWinner: function(result) {
      if (result.isPickCorrect && result.game.status !== 'P') {
        return result.isPickCorrect ? 'checkmark' : 'remove';
      } else if (!result.isPickCorrect && result.game.status !== 'P') {
        return result.isPickCorrect ? 'checkmark' : 'remove';
      } else {
        return 'minus';
      }
    },
    getWinnerClass: function(result) {
      if (result.isPickCorrect && result.game.status !== 'P') {
        return result.isPickCorrect ? 'green' : 'red';
      } else if (!result.isPickCorrect && result.game.status !== 'P') {
        return result.isPickCorrect ? 'green' : 'red';
      } else {
        return 'yellow';
      }
    },
    getWinnerPercentage: function(picks) {

      if(typeof picks !== 'undefined') {
        var total = 0,
            correct = 0;
        picks.forEach(function(d, i) {
          var result = d.getResult();
          if(result.isPickCorrect && result.game.status !== 'P') {
            total++;
            correct++;
          } else if (!result.isPickCorrect && result.game.status !== 'P') {
            total++;
          }
        });
        var percentage = correct / total;
        return isNaN(percentage) ? 0 : Math.ceil(percentage * 100);
      }
      else {
        return 0;
      }
    },
    getFractions: function(picks) {
      if(typeof picks !== 'undefined') {
        var total = 0,
            correct = 0;
        picks.forEach(function(d, i) {
          var result = d.getResult();
          if(result.isPickCorrect && result.game.status !== 'P') {
            total++;
            correct++;
          } else if (!result.isPickCorrect && result.game.status !== 'P') {
            total++;
          }
        });
        return correct + ' / ' + total;
      }
      else {
        return '- / -';
      }
    }
  });

  Template.mainContentVersus.rendered = function() {

    // Leaderboard
    Meteor.setTimeout(function() {

      var leaderboard = [];

      $(".ui.statistic > .value").each(function() {
        var percentage = typeof this.id !== 'undefined' ? this.id : null;
        var contentContainer = $(this).closest('.card');
        var userIdEl = typeof $(contentContainer).attr('id') !== 'undefined' ? $(contentContainer).attr('id') : null;

        if(percentage && userIdEl) {
          leaderboard.push({
            userId: userIdEl.split('-')[1],
            percentage: percentage,
            divEl: '#card-' + userIdEl.split('-')[1]
          });

        }
      });

      leaderboard.sort(function(a, b) {
        return parseInt(b.percentage) - parseInt(a.percentage);
      });

      // console.log("leaderboard:", leaderboard);

      var cont = $('#cards');
      $.each(leaderboard, function(i, v) {
          cont.append($(v.divEl));
      });

    }, 1000);


  };


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

      // Find users
      var users = Meteor.users.find({}).fetch();
      if(typeof users !== 'undefined') {
        users.forEach(function(d) {
          d.name = d.profile["first-name"];
          d.color = d.profile["fav-color"];
        });

        return users;
      }
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
    getWinner: function(result) {
      return result.isPickCorrect ? 'checkmark' : 'remove';
    },
    getWinnerClass: function(result) {
      return result.isPickCorrect ? 'green' : 'red';
    },
    getWinnerPercentage: function(picks) {

      if(typeof picks !== 'undefined') {
        var total = 0,
            correct = 0;
        picks.forEach(function(d, i) {
          total++;
          var result = d.getResult();
          if(result.isPickCorrect)
            correct++;
        });
        var percentage = correct / total;
        return isNaN(percentage) ? 0 : Math.ceil(percentage * 100);
      }
      else {
        return 'No Picks :(';
      }
    },
    getFractions: function(picks) {
      if(typeof picks !== 'undefined') {
        var total = 0,
            correct = 0;
        picks.forEach(function(d, i) {
          total++;
          var result = d.getResult();
          if(result.isPickCorrect)
            correct++;
        });
        return correct + ' / ' + total;
      }
      else {
        return '- / -';
      }
    }
  });

  Template.mainContentVersus.rendered = function() {

    Meteor.setTimeout(function() {
      // defaults
      if(typeof Session.get('showPicks') === 'undefined') {
        console.log("setting showPicks to false");
        Session.set('showPicks', false);
        $('.ui.accordion').accordion();
      }

      if(typeof Session.get('showPicks') !== 'undefined') {
        showPicks = Session.get('showPicks');
        if(showPicks === true) {
            $('.ui.accordion').accordion('open', 0);
        }
      }

      var pickIds = $.map($(".picks > .item"), function(n, i){
        return n.id.split('-')[1];
      });
      var users = _.uniq(pickIds, function(d) {
          return d;
        });

      var stats = [];
      users.forEach(function(d, i) {
        var user = {
          id: d,
          win: 0,
          loss: 0,
          games: 0
        };

        $(".picks > .item").each(function(index, value){
          var id = this.id.split('-')[1];
          if(id === d) {
            var icon = $(this).find("i");
            var classList = $(icon).attr('class');
            if(classList.indexOf('green') > -1) {
              user.win++;
              user.games++;
            } else if (classList.indexOf('red') > -1) {
              user.loss++;
              user.games++;
            }
            else {

            }
          }

          if(index === pickIds.length - 1) {
            stats.push(user);
          }
       });

       if(i === users.length -1) {
         Session.set('stats', stats);
       }
      });
    }, 3000)


  };

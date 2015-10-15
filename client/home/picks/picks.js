
  Template.mainContentPicks.helpers({
    games: function() {
      var week = parseInt(Router.current().params.week);

      if(!Router.current().params.week) {
        week = Session.get('week');
      }

      return Games.find({ week: week }, { sort: { gameId: 1 }});
    },
    getOdds: function(game) {
      var odd = Odds.findOne({ gameId: game.eid.toString() });
      if(typeof odd !== 'undefined') {
        return odd.pick + ' must win by '+ Math.abs(odd.spread) +'';
      }
    },
    isActive: function(game) {
      // Use eid to get game date string, add game time to end
      var gameDateStr = game.eid.toString().substring(0, 8);
          gameDateStr += '-' + game.gameTime + ' pm';
      // Convert game date string to moment date
      var gameDate = moment(gameDateStr, 'YYYYMMDD-h:mm a');
      // Set expiry time to 1 hour before game time
      var expiry = moment(gameDate).subtract(1, 'hours');
      // Compare current time to expiry
      if (moment().isBefore(expiry)) {
      } else {
        Meteor.setTimeout(function() {
          document.getElementById("pick-"+game.eid+"-"+game.home.code).setAttribute("disabled", "disabled");
          document.getElementById("pick-"+game.eid+"-"+game.away.code).setAttribute("disabled", "disabled");
        }, 2000);
      }
    }
  });

  Template.mainContentPicks.events({
    'click .savePicks': function() {
        var week = parseInt(Router.current().params.week);

        if(!Router.current().params.week) {
          week = Session.get('week');
        }
        // console.log($('.form-picks').serialize());
        var form = $('.form-picks').serialize().split('&');
        var picks = [];
        form.forEach(function(d) {
          var pick = d.split('=');
          picks.push({ key: pick[0], val: pick[1], week: week });
        });
        Meteor.call('savePicks', picks, function(err, response) {
          $.semanticUiGrowl('Picks were saved :)');
        });
    }
  });

  Template.mainContentPicks.rendered = function() {
    $('.ui.radio.checkbox').checkbox();

    if(Meteor.user()) {
      $(":radio").each(function(){
        if(this.id.split('-')[0] === 'pick') {
          var pick = Picks.findOne({
            userId: Meteor.user()._id,
            gameId: this.id.split('-')[1]
          });
          if(typeof pick !== 'undefined') {
            if(this.id.split('-')[2] === pick.pick) {
                $(this).prop("checked", true);
            }
          }
        }
      });
    }

  };

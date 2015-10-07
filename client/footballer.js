if (Meteor.isClient) {

  Meteor.startup(function() {
    if(Session.get('currentWeek') === undefined) {
      Session.set('currentWeek', 5);
    }
  });

  Template.loginButtons.rendered = function()
  {
      Accounts._loginButtonsSession.set('dropdownVisible', true);
  };

  Template.siteHeader.events({
    'click .selectWeek': function(event) {
        Session.set('currentWeek', event.target.id);
        console.log("currentWeek", Session.get('currentWeek'));
    },
    'click .refreshGameData': function () {
      Meteor.call('getGameData',function(response) {
        console.log("response:", response);
      });
    }
  });

  Template.siteHeader.rendered = function() {
    $('.ui.dropdownMenu').dropdown();
    $('.menu .item').tab();
  };

  Template.mainHeader.helpers({
    currentWeek: function() {
      return Session.get('currentWeek');
    }
  });

  Template.mainContentScores.helpers({
    games: function() {
        return Games.find({ week: Session.get('currentWeek') });
    },
    scoreHomeClass: function(game) {
      var diff = game.home.score - game.away.score;
      if(diff === 0) {
        return 'black';
      } else if (diff > 0) {
        return 'green';
      } else if (diff < 0) {
        return 'red';
      }
    },
    scoreAwayClass: function(game) {
      var diff = game.away.score - game.home.score;
      if(diff === 0) {
        return 'black';
      } else if (diff > 0) {
        return 'green';
      } else if (diff < 0) {
        return 'red';
      }
    },
    getStatus: function(status) {
      var statusStr = '';
      switch(status) {
        case 'F' : statusStr = 'Final'; break;
        case 'FO' : statusStr = 'Final (Overtime)'; break;
        case 'P' : statusStr = 'Pre-game'; break;
      }
      return statusStr;
    }
  });

  Template.mainContentPicks.helpers({
    games: function() {
        return Games.find({ week: Session.get('currentWeek') });
    }
  });

  Template.mainContentPicks.events({
    'click .savePicks': function() {
        console.log($('.form-picks').serialize());
        var form = $('.form-picks').serialize().split('&');
        var picks = [];
        form.forEach(function(d) {
          var pick = d.split('=');
          picks.push({ key: pick[0], val: pick[1] });
        });
        Meteor.call('savePicks', picks, function(err, response) {
          console.log("response:", response);
        });
    }
  });

  Template.mainContentPicks.rendered = function() {
    $('.ui.radio.checkbox').checkbox();

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
  };

  Template.mainContentOdds.helpers({
    games: function() {
        return Games.find({ week: Session.get('currentWeek') });
    }
  });

  Template.mainContentOdds.events({
    'click .saveOdds': function() {
        // console.log($('.form-odds').serialize());
        var form = $('.form-odds').serialize().split('&');
        // console.log("form:", form);
        var odds = [];
        form.forEach(function(d) {
          var code = d.split('-')[0];
          if(odds.length) {
            var idx = odds.map(function(e) { return e.key; }).indexOf(code);
            if(idx > -1) {
              // Located the spread
              odds[idx].spread = d.split('=')[1];
            } else {
              // other new key entries (it's a code)
              var odd = {
                key: code,
                week: Session.get('currentWeek'),
                val: d.split('=')[1],
                spread: null
              };
              odds.push(odd);
            }
          } else {
            // First array entry (it's a code)
            var odd = {
              key: code,
              week: Session.get('currentWeek'),
              val: d.split('=')[1],
              spread: null
            };
            odds.push(odd);
          }

        });

        console.table(odds);
        Meteor.call('saveOdds', odds, Session.get('currentWeek'), function(err, response) {
          console.log("response:", response);
        });
    }
  });

  Template.mainContentOdds.rendered = function() {
    $('.ui.radio.checkbox').checkbox();

    $(":radio").each(function(){
      if(this.id.split('-')[0] === 'odd') {
        // console.log("id:", this.id);
        var odd = Odds.findOne({
          week: Session.get('currentWeek'),
          gameId: this.id.split('-')[1]
        });
        if(typeof odd !== 'undefined') {
          if(this.id.split('-')[2] === odd.pick) {
              $(this).prop("checked", true);
          }
        }
      }
   });

   $(":input").each(function(){
     if(this.id.split('-')[0] === 'odd' && this.id.split('-')[2] === 'spread'){
       console.log("id:", this.id);
       var odd = Odds.findOne({
         week: Session.get('currentWeek'),
         gameId: this.id.split('-')[1]
       });
       if(typeof odd !== 'undefined') {
         if(this.id.split('-')[1] === odd.gameId) {
             $(this).prop("value", odd.spread);
         }
       }
     }
   });
  };
}

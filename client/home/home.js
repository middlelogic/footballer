if(Meteor.isClient) {
  Template.mainHeader.helpers({
    currentWeek: function() {
      return Router.current().params.week;
    }
  });

  Template.mainContent.events({
    'click .refreshGameData': function () {
      Meteor.call('getGameData',function(response) {
        $.semanticUiGrowl('Scores were refreshed :)');
        Router.current().render(Template.home);
      });
    }
  });

  Template.mainContent.rendered = function() {

      $('.menu .item').tab();

  };

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
        case 'F' : statusStr = 'Final'; break;
        case 'FO' : statusStr = 'Final (OT)'; break;
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
      return game.redZone > -1 ? 'red' : '';
    }
  });

  Template.mainContentPicks.helpers({
    games: function() {
      var week = parseInt(Router.current().params.week);
      return Games.find({ week: week }, { sort: { gameId: 1 }});
    },
    getOdds: function(game) {
      var odd = Odds.findOne({ gameId: game.eid.toString() });
      if(typeof odd !== 'undefined') {
        return odd.pick + ' must win by '+ Math.abs(odd.spread) +'';
      }
    }
  });

  Template.mainContentPicks.events({
    'click .savePicks': function() {
        // console.log($('.form-picks').serialize());
        var form = $('.form-picks').serialize().split('&');
        var picks = [];
        form.forEach(function(d) {
          var pick = d.split('=');
          picks.push({ key: pick[0], val: pick[1] });
        });
        Meteor.call('savePicks', picks, function(err, response) {
          $.semanticUiGrowl('Picks were saved :)');
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
      var week = parseInt(Router.current().params.week);
      return Games.find({ week: week }, { sort: { gameId: 1 }});
    }
  });

  Template.mainContentOdds.events({
    'click .saveOdds': function() {
        // console.log($('.form-odds').serialize());
        var form = $('.form-odds').serialize().split('&');
        var week = parseInt(Router.current().params.week);
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
                week: week,
                val: d.split('=')[1],
                spread: null
              };
              odds.push(odd);
            }
          } else {
            // First array entry (it's a code)
            var odd = {
              key: code,
              week: week,
              val: d.split('=')[1],
              spread: null
            };
            odds.push(odd);
          }

        });
        // console.table(odds);
        Meteor.call('saveOdds', odds, week, function(err, response) {
          $.semanticUiGrowl('Odds were saved :)');
        });
    }
  });

  Template.mainContentOdds.rendered = function() {

    var week = parseInt(Router.current().params.week);

    $('.ui.radio.checkbox').checkbox();

    $(":radio").each(function(){
      if(this.id.split('-')[0] === 'odd') {
        // console.log("id:", this.id);
        var odd = Odds.findOne({
          week: week,
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
       // console.log("id:", this.id);
       var odd = Odds.findOne({
         week: week,
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

  Template.mainContentVersus.helpers({
    'users': function() {
      var users = Meteor.users.find({}).fetch();
      users.forEach(function(d) {
        d.name = d.profile["first-name"];
        d.color = d.profile["fav-color"];
      });
      // console.log("users:", users);
      return users;
    },
    'picks': function(userId) {
      var picks = [];
      var week = parseInt(Router.current().params.week);
      var games = Games.find({ week: week }, { sort: { eid: 1 }});
      if(typeof games !== 'undefined') {
        games.forEach(function(d, i) {
          var pick = Picks.findOne({
            gameId: d.eid.toString(), userId: userId
          });
          var odd = Odds.findOne({
            gameId: d.eid.toString(), week: week
          });
          if(typeof pick !== 'undefined') {
            picks.push({ pick: pick, game: d, odd: odd});
          }
        });
        return picks;
      }
    },
    getName: function(item) {
      var pick = item.pick.pick,
          name, code;

      if(item.game.home.code === pick) {
        name = item.game.home.name;
        code = item.game.home.code;
      }
      else {
        name = item.game.away.name;
        code = item.game.away.code;
      }
      return name + ' ('+ code +')';
    },
    getWinnerPercentage(userId) {
        return Session.get(userId + '-percentage');
    },
    getWinner: function(item) {
      var code = item.pick.pick;

      // Pick is Home Team
      if(item.game.home.code === code) {

        var home = item.game.home.code,
            homeDiff = item.game.home.score - item.game.away.score,
            awayDiff = item.game.away.score - item.game.home.score,
            pick = item.odd.pick,
            spread = item.odd.spread,
            isFav = false,
            winner = null;

        if(pick === code && spread < 0) {
          isFav = true;
        }

        // If no score
        if(homeDiff === 0) { winner = null; }
        // If winning
        else if (homeDiff > 0) {
          // Not favored
          if(!isFav) {
            winner = item.game.home.code;
          } else {
            // Covers the spread?
            if((item.game.home.score -  Math.abs(spread) - item.game.away.score) > 0) {
              winner = item.game.home.code;
            } else {
              winner = item.game.away.code;
            }
          }
        // if losing
        } else if (homeDiff < 0) {
          // Favored
          if(isFav) {
            winner = item.game.away.code;
          }
          // Not Favored
          else {
              // Covers the spread?
              if(item.game.home.score - (item.game.away.score - Math.abs(spread)) > 0) {
                winner = item.game.home.code;
              } else {
                winner = item.game.away.code;
              }
          }
        }
      }
      // Pick is Away Team
      else {
        var away = item.game.away.code,
            homeDiff = item.game.home.score - item.game.away.score,
            awayDiff = item.game.away.score - item.game.home.score,
            pick = item.odd.pick,
            spread = item.odd.spread,
            isFav = false,
            winner = null;

        if(pick === code && spread < 0) {
          isFav = true;
        }

        // If no score
        if(awayDiff === 0) { winner = null }
        // If winning
        else if (awayDiff > 0) {
          // Not favored
          if(!isFav) {
            winner = item.game.away.code;
          } else {
            // Covers the spread?
            if((item.game.away.score -  Math.abs(spread) - item.game.home.score) > 0) {
              winner = item.game.away.code;
            } else {
              winner = item.game.home.code;
            }
          }
        // if losing
        } else if (awayDiff < 0) {
          // Favored
          if(isFav) {
            winner = item.game.home.code;
          }
          // Not Favored
          else {
              // Covers the spread?
              if(item.game.away.score - (item.game.home.score - Math.abs(spread)) > 0) {
                winner = item.game.away.code;
              } else {
                winner = item.game.home.code;
              }
          }
        }
      }
      if(winner === code) {
        return 'checkmark';
      } else if(winner !== null) {
        return 'remove';
      }
    },
    getWinnerClass: function(item) {
      var code = item.pick.pick;

      // Pick is Home Team
      if(item.game.home.code === code) {

        var home = item.game.home.code,
            homeDiff = item.game.home.score - item.game.away.score,
            awayDiff = item.game.away.score - item.game.home.score,
            pick = item.odd.pick,
            spread = item.odd.spread,
            isFav = false;

        if(pick === code && spread < 0) {
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
            if((item.game.home.score -  Math.abs(spread) - item.game.away.score) > 0) {
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
              if(item.game.home.score - (item.game.away.score - Math.abs(spread)) > 0) {
                return 'green';
              } else {
                return 'red';
              }
          }
        }
      }
      // Pick is Away Team
      else {
        var away = item.game.away.code,
            homeDiff = item.game.home.score - item.game.away.score,
            awayDiff = item.game.away.score - item.game.home.score,
            pick = item.odd.pick,
            spread = item.odd.spread,
            isFav = false;

        if(pick === code && spread < 0) {
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
            if((item.game.away.score -  Math.abs(spread) - item.game.home.score) > 0) {
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
              if(item.game.away.score - (item.game.home.score - Math.abs(spread)) > 0) {
                return 'green';
              } else {
                return 'red';
              }
          }
        }
      }

    },
    getWinnerPercentage: function(userId) {
      var stats = Session.get('stats'),
          percentage;

      stats.forEach(function(d) {
        if(d.id === userId) {
          percentage = (d.win / (d.loss + d.win)) * 100;
        }
      });

      return Math.ceil(percentage);
    },
    getFractions: function(userId) {
      var stats = Session.get('stats'),
          fractions;

      stats.forEach(function(d) {
        if(d.id === userId) {
          var totalGames = d.loss + d.win;
          fractions = d.win + ' / ' + totalGames;
        }
      });

      return fractions;
    }
  });

  Template.mainContentVersus.rendered = function() {

    $('.ui.accordion').accordion('open', 0);


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
        loss: 0
      };

      $(".picks > .item").each(function(index, value){
        var id = this.id.split('-')[1];
        if(id === d) {
          var icon = $(this).find("i");
          var classList = $(icon).attr('class');
          if(classList.indexOf('green') > -1) {
            user.win++;
          }
          else {
            user.loss++;
          }
        }

        if(index === pickIds.length - 1) {
          stats.push(user);
        }
     });

     if(i === users.length -1) {
       console.log("stats:", stats);
       Session.set('stats', stats);
     }
    });



  };
}

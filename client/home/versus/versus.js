
  Template.mainContentVersus.events({
    'click .showPicks': function() {
      var showPicks;
      if(typeof Session.get('showPicks') !== 'undefined') {
        showPicks = Session.get('showPicks');
        if(showPicks !== 'undefined') {
          if(showPicks === false) {
            Session.set('showPicks', true);
            $('.ui.accordion').accordion('open', 0);
          }
          else if(showPicks === true) {
            Session.set('showPicks', false);
            $('.ui.accordion').accordion('close', 0);
          }
        }
        else {
          Session.set('showPicks', true);
          $('.ui.accordion').accordion('open', 0);
        }
      }
      else {
        Session.set('showPicks', true);
        $('.ui.accordion').accordion('open', 0);
      }
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

        // // If logged in, move current user to top of array
        // if(Meteor.userId()) {
        //
        //   var userIdx;
        //   users.forEach(function(d, i) {
        //     if(d._id === Meteor.userId()) {
        //       // console.log("user found");
        //       userIdx = i;
        //     }
        //   });
        //
        //   var user = users[userIdx];
        //   users.splice(userIdx, 1);
        //   users.splice(0, 0, user);
        //
        // }

        return users;
      }
    },
    'picks': function(userId) {

      var picks = [],
          week = parseInt(Router.current().params.week);

      if(!Router.current().params.week) {
        week = Session.get('week');
      }

      if(week !== null) {
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
        }
      }

      return picks;

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
              var status = this.id.split('-')[2];
              // console.log("status:", status);
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

        if(typeof stats !== 'undefined') {
          stats.forEach(function(d) {
            if(d.id === userId) {
              percentage = (d.win / d.games) * 100;
            }
          });
          if(isNaN(percentage)) {
            return 'No picks :(';
          }
          else {
            return '' + Math.ceil(percentage) + '%';
          }


        } else {
          return '' + 0 + '%';
        }

    },
    getFractions: function(userId) {
      var stats = Session.get('stats'),
          fractions;

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
              var status = this.id.split('-')[2];
              // console.log("status:", status);
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

      if(typeof stats !== 'undefined') {
        stats.forEach(function(d) {
          if(d.id === userId) {
            var totalGames = d.loss + d.win;
            fractions = d.win + ' / ' + totalGames;
          }
        });
        return fractions;
      }
      else {
        return '- / -';
      }
    },
    userCount: function(users) {
      return users < 4 ? '3' : '4';
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

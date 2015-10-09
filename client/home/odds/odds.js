
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

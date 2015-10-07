Meteor.methods({
  saveOdds: function(_odds, _week, cb) {

    console.log("odds:", _odds);
    _odds.forEach(function(d, i) {

      var odd = Odds.findOne({ week: _week, gameId: d.key });
      if(typeof odd === 'undefined') {
        var odd = {
          gameId: d.key,
          week: d.week,
          pick: d.val,
          spread: d.spread
        };
        Odds.insert(odd);

      } else {
        Odds.update(
          { _id: odd._id},
          { $set: {
            week: odd.week,
            gameId: odd.gameId,
            pick: d.val,
            spread: d.spread
          }}
        );
      }
      if(i === _odds.length -1) {
          return true;
      }
    });
  }
});

Meteor.methods({
  savePicks: function(picks, cb) {

    console.log("picks:", picks);
    // picks
    // user
    // game eid
    picks.forEach(function(d, i) {

      var pick = Picks.findOne({ userId: Meteor.user()._id, gameId: d.key });
      if(typeof pick === 'undefined') {
        // console.log("Pick not found");
        var pick = {
          gameId: d.key,
          userId: Meteor.user()._id,
          pick: d.val
        };
        Picks.insert(pick);

      } else {
        // console.log("Pick was found!");
        Picks.update(
          { _id: pick._id},
          { $set: {
            userId: Meteor.user()._id,
            gameId: d.key,
            pick: d.val
          }}
        );
      }
      if(i === picks.length -1) {
          return true;
      }
    });
  }
});

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
          pick: d.val,
          week: d.week
        };
        Picks.insert(pick);

      } else {
        // console.log("Pick was found!");
        Picks.update(
          { _id: pick._id},
          { $set: {
            userId: Meteor.user()._id,
            gameId: d.key,
            pick: d.val,
            week: d.week
          }}
        );
      }
      if(i === picks.length -1) {
          return true;
      }
    });
  },
  saveLegacyPicks: function(picks, cb) {

    console.log("legacy picks:", picks);
    // picks
    // user
    // game eid
    picks.forEach(function(d, i) {

      var pick = Picks.findOne({ userId: d.userId, gameId: d.gameId });
      if(typeof pick === 'undefined') {
        console.log("Pick not found");
      } else {
        console.log("Pick was found!", pick);
        Picks.update(
          { _id: pick._id},
          { $set: {
            userId: d.userId,
            gameId: d.gameId,
            pick: d.pick,
            week: d.week
          }}
        );
      }
      if(i === picks.length -1) {
          return true;
      }
    });
  },
  addWeekToLegacyPicks: function(cb) {
    // 1. Get all legacy games
    // 2. Iterate over each game, getting its week #
    // 3. Use gameId(eid) to find all Picks
    // 4. Iterate over picks, adding week #
    // 5. Update each picks array (pass to this.savePicks)

    // 1. Get all legacy games
    // Using Fetch returns array (not cursor)
    var games = Games.find({}).fetch();
    // console.log("Found games:", games.length);

    // 2. Iterate over each game, getting its week #
    games.forEach(function(g, i) {

      // 3. Use gameId(eid) to find all Picks
      var week = g.week,
          gId = g.eid.toString(),
          picks = Picks.find({ gameId: gId }).fetch();

      // console.log("Found picks:", picks.length);
      // 4. Iterate over picks, adding week #
      picks.forEach(function(pick, i) {
        // Add week # to Pick
        pick.week = week;
        // console.log("pick:", pick);
        if(i === picks.length -1) {
          Meteor.call('saveLegacyPicks', picks, function(res) {
            console.log("saved.");
          });
        }
      });

    });
    return 'Found ' + games.length + ' games.';
  }
});

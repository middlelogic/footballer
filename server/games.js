Meteor.methods({
  storeGameData: function(data, cb) {

    var _week = data.w;
    var _games = data.gms;

    _games.forEach(function(d, i) {
      var game = Games.findOne({eid: d.eid});
      if(typeof game == 'undefined'){
         var game = {
            eid: d.eid,
            ga: d.ga,
            gsis: d.gsis,
            week: _week,
            gameDay: d.d,
            status: d.q,
            gameTime: d.t,
            home: {
              code: d.h,
              name: d.hnn,
              score: d.hs
            },
            away: {
              code: d.v,
              name: d.vnn,
              score: d.vs
            },
            redZone: d.rz,
            createdAt: new Date()
         };
         Games.insert(game);
      }
      else{
         Games.update(
           { _id: game._id },
           { $set:
             {
               eid: d.eid,
               ga: d.ga,
               gsis: d.gsis,
               status: d.q,
               gameTime: d.t,
               weekDay: d.d,
               home: {
                 code: d.h,
                 name: d.hnn,
                 score: d.hs
               },
               away: {
                 code: d.v,
                 name: d.vnn,
                 score: d.vs
               },
               redZone: d.rz
             }
           });
      }
    });

    cb({ success: true });
  },
  getGameData: function () {
    var response, data, res;
    try {
        var data = request.sync("http://www.nfl.com/liveupdate/scorestrip/ss.json");
        if (data.response.statusCode == 200) {
            Meteor.call('storeGameData', JSON.parse(data.body), function(d) {
              if(d.success === true) {
                return true;
              } else {
                return false;
              }
            });
        }
    } catch (error) {
        // See below for info on errors
        console.log(error.toString());
    }
  },
  getCurrentWeek: function() {
    var response, data, res;
    try {
        var data = request.sync("http://www.nfl.com/liveupdate/scorestrip/ss.json");
        if (data.response.statusCode == 200) {
            var res = JSON.parse(data.body);
            console.log("getting current week...", res.w);
            return res.w;
        }
    } catch (error) {
        // See below for info on errors
        console.log(error.toString());
    }
  }
});

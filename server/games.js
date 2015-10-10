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
    console.log("Getting Game data...");
    var response, data, res;
    try {
        // var url = "http://www.mocky.io/v2/56190a73100000d41e07771c";
        var url = "http://www.nfl.com/liveupdate/scorestrip/ss.json";
        var data = request.sync(url);
        // console.log("data:", data);
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
    return Router.current().params.week;
  }
});

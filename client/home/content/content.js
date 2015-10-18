// var countdown = new ReactiveCountdown(30);
//
// countdown.start(function() {
//
//     // do something when this is completed
//     countdown.start();
//
//     $('.menu .item').tab();
//
//     Meteor.call('getGameData',function(response) {
//       // Session.set('noRender', true);
//       // Meteor.setTimeout(function() {
//         // Session.set('noRender', false);
//       // }, 1);
//     });
// });

Template.mainContent.helpers({
  currentUser: function(){
    return Meteor.user();
  }
  // ,
  // 'noRender': function() {
  //     return Session.get('noRender');
  // }
});


Template.mainContent.rendered = function() {

  $('.menu .item').tab();

  if(!Router.current().params.week) {
    $.getJSON( "http://www.nfl.com/liveupdate/scorestrip/ss.json", {} )
      .done(function( json ) {
        Session.set('week', json.w);
        Meteor.call('getGameData',function(response) {
          Router.current().render(Template.mainContentScores, { to: 'mainContentScores' });
          Router.current().render(Template.mainContentVersus, { to: 'mainContentVersus' });
        });
      })
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        Router.go('/4', {week: 4}, {query: 'q=s', hash: 'hashFrag'});
      });
  }
};

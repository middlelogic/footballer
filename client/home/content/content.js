var countdown = new ReactiveCountdown(30);

countdown.start(function() {

    // do something when this is completed
    countdown.start();

    $('.menu .item').tab();
    Meteor.call('getGameData',function(response) {
      Router.current().render(Template.mainContentScores, { to: 'mainContentScores' });
      Router.current().render(Template.mainContentVersus, { to: 'mainContentVersus' });
    });
});

Template.mainContent.helpers({
  getCountdown: function() {
        var number = countdown.get();
        return number >= 10 ? '0:' + countdown.get() : '0:0' + countdown.get();
  },
  currentUser: function(){
    return Meteor.user();
  }
});

Template.mainContent.rendered = function() {

  $('.menu .item').tab();

  if(!Router.current().params.week) {
    $.getJSON( "http://www.nfl.com/liveupdate/scorestrip/ss.json", {} )
      .done(function( json ) {
        Session.set('week', json.w);
      })
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        Router.go('/4', {week: 4}, {query: 'q=s', hash: 'hashFrag'});
      });
  }
};

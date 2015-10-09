var countdown = new ReactiveCountdown(30);

countdown.start(function() {

    // do something when this is completed
    countdown.start();

    Meteor.call('getGameData',function(response) {
      Router.current().render(Template.mainContentScores, { to: 'mainContentScores' });
      Router.current().render(Template.mainContentVersus, { to: 'mainContentVersus' });
      Router.current().render(Template.mainContentPicks, { to: 'mainContentPicks' });
      Router.current().render(Template.mainContentOdds, { to: 'mainContentOdds' });
    });


});

Template.mainContent.helpers({
  isAdmin: function(user) {
    var u = Meteor.users.findOne({ _id: user._id });
    if(typeof user !== 'undefined') {
      if(typeof u.profile.role !== 'undefined') {
        return u.profile.role === 'admin' ? true : false;
      } else {
        return false;
      }
    } else {
        return false;
    }
  },
  getCountdown: function() {
        var number = countdown.get();
        return number >= 10 ? '0:' + countdown.get() : '0:0' + countdown.get();
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

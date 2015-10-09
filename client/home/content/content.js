var countdown = new ReactiveCountdown(30);

countdown.start(function() {

    // do something when this is completed
    countdown.start();

    $('.menu .item').tab();
    Meteor.call('getGameData',function(response) {
      Router.current().render(Template.home, { to: 'home' });
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

  $('.menu .item').tab({
    alwaysRefresh: true,
    onVisible: function(){
      Router.current().render(Template.home, { to: 'home' });
    }
  });
};

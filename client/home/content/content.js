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

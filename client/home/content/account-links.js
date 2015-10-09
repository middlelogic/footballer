Template.accountLinks.helpers({
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

Template.accountLinks.rendered = function(){
  $('.menu .item').tab({
    alwaysRefresh: true,
    onVisible: function(){
      // Router.current().render(Template.home, { to: 'home' });
    }
  });
}

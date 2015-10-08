Template.loginButtons.rendered = function()
{
    Accounts._loginButtonsSession.set('dropdownVisible', true);
};

Template.siteHeader.helpers({
  weeks: function() {
    return _.uniq(Games.find({}, {
        sort: { week: 1}, fields: { week: true}
      }).fetch().map(function(d) {
        return d.week;
      }), true
    );
  }
});

Template.siteHeader.events({
  'click .selectWeek': function(event) {
      Router.current().render(Template.mainContent);
  }
});

Template.siteHeader.rendered = function() {
  $('.ui.dropdownMenu').dropdown();

  if(!Router.current().params.week) {
    var weeks = _.uniq(Games.find({},
      { sort: { week: 1}, fields: { week: true}}).fetch().map(function(d) {
          return d.week;
        })
    );
    Router.go('/' + weeks[weeks.length -1], {week: 5}, {query: 'q=s', hash: 'hashFrag'});
  }

  Tracker.autorun(function(){
  if(Meteor.userId()){
    Router.current().render(Template.mainContent);
  }
});
};

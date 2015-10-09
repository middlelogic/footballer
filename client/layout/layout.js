Tracker.autorun(function(){
  if(Meteor.userId()){
    if(typeof Session.get('userId') !== 'undefined') {
      if(Session.get('userId') !== Meteor.userId()) {
        Session.set('userId', userId);
        console.log("new user...")
        Router.current().render(Template.home, { to: 'home' });
      }
    }
  }
});

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
      $.getJSON( "http://www.nfl.com/liveupdate/scorestrip/ss.json", {} )
        .done(function( json ) {
          Router.go('/' + json.w, {week: json.w}, {query: 'q=s', hash: 'hashFrag'});
        })
        .fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ", " + error;
          Router.go('/4', {week: 4}, {query: 'q=s', hash: 'hashFrag'});
      });
    }

  };

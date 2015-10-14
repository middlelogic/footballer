Tracker.autorun(function(){
  if(Meteor.userId()){
    if(typeof Session.get('userId') !== 'undefined') {
      if(Session.get('userId') !== Meteor.userId()) {
        Session.set('userId', userId);
        // console.log("new user...")
        Router.current().render(Template.home, { to: 'home' });
      }
    }
  } else {
    // console.log("user logged out.");
    Meteor.setTimeout(function() {
      $('.menu > .item.active').removeClass('active');
      $('.ui .tab').removeClass('active');
      $('.menu > .item').each(function(index, value) {
          if(this.id === 'first') {
            $(this).addClass('active');
            $('.ui.tab[id=first]').addClass('active');
          }
      });

    }, 250);
  }
});

Template.loginButtons.rendered = function()
{
    Accounts._loginButtonsSession.set('dropdownVisible', true);
};

Template.siteHeader.helpers({
  weeks: function() {
    return _.uniq(Games.find({}, {
        sort: { week: -1}, fields: { week: true}
      }).fetch().map(function(d) {
        return d.week;
      }), true
    );
  },
  currentUser: function(){
    return Meteor.user();
  },
  isAdmin: function(user) {
    if(typeof Meteor.user() !== 'undefined') {
      var u = Meteor.users.findOne({ _id: Meteor.userId() });
      if(typeof u !== 'undefined') {
        if(typeof u.profile.role !== 'undefined') {
          return u.profile.role === 'admin' ? true : false;
        } else {
          return false;
        }
      } else {
          return false;
      }
    } else {
      return false;
    }

  }
});

Template.siteHeader.events({
  'click .selectWeek': function(event) {
      Router.current().render(Template.mainContent);
  },
  'click .addWeekToLegacyPicks': function() {
    Meteor.call('addWeekToLegacyPicks', function(response) {
      console.log("response:", response);
    });
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

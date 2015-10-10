Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/:week', {
  template: 'home',
  yieldTemplates: {
    'mainContent': {to: 'home'}
  },
  data: function(pause) {
    var self = this;

    $.getJSON( "http://www.nfl.com/liveupdate/scorestrip/ss.json", {} )
      .done(function( json ) {
        Session.set('week', json.w);
        return json.w;
      })
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log("err");
    });
  }
});

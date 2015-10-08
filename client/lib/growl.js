Meteor.startup(function() {
  $.semanticUiGrowl.defaultOptions = {
    ele: 'body',
    type: 'info',
    offset: {
      from: 'top',
      amount: 50
    },
    align: 'right',
    width: 200,
    delay: 1500,
    allow_dismiss: true,
    stackup_spacing: 10
  };
});

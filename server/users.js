Meteor.methods({
  resetUserPassword: function() {

    var userId = 'zz43yBbJKWFsGDj2p',
        newPassword = 'nfl2015';

    Accounts.setPassword(userId, newPassword);

  }
})

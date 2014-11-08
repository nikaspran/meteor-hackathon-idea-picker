Accounts.onLogin(function (attempt) {
  var user = attempt.user;
  Avatars.update(user._id, {$set: {url: 'https://avatars.githubusercontent.com/u/' + user.services.github.id + '?s=20'}}, {upsert: true});
});

Meteor.publish('avatars', function () {
  return Avatars.find();
});
Meteor.publish('ideas', function () {
  return Ideas.find();
});
Meteor.subscribe('userData');
Meteor.subscribe('ideas');
Meteor.subscribe('avatars');

Template.newIdea.events({
  'submit .new-idea': function (event) {
    Ideas.insert({
      name: event.target.name.value,
      votes: {},
      score: 0,
      users: []
    });

    event.target.name.value = '';
    return false;
  }
});

Template.ideaList.helpers({
  ideas: function () {
    return Ideas.find({}, {sort: {score: -1}});
  }
});

Template.ideaItem.helpers({
  votedUp: function () {
    return this.votes[Meteor.userId()] === 1;
  },
  votedDown: function () {
    return this.votes[Meteor.userId()] === -1;
  },
  avatarSrc: function () {
    var avatar = Avatars.findOne(this.toString());
    return avatar && avatar.url;
  },
  joined: function () {
    return this.users.indexOf(Meteor.userId()) > -1;
  }
});

function calculateScore(votes) {
  var voteCount = 0;
  $.each(votes, function (key, value) {
    voteCount += value;
  });
  return voteCount;
}

function vote(idea, score) {
  var update = {}, newVote = idea.votes[Meteor.userId()] === score ? 0 : score;
  idea.votes[Meteor.userId()] = newVote;
  update['votes.' + Meteor.userId()] = newVote;
  update.score = calculateScore(idea.votes);
  Ideas.update(idea._id, {$set: update});
}

Template.ideaItem.events({
  'click .upvote': function () {
    vote(this, 1);
  },
  'click .downvote': function () {
    vote(this, -1);
  },
  'click .join': function () {
    Ideas.update(this._id, {$addToSet: {users: Meteor.userId()}});
  },
  'click .leave': function () {
    Ideas.update(this._id, {$pull: {users: Meteor.userId()}});
  }
});
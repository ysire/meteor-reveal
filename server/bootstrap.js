// Lists -- {name: String}
Slides = new Meteor.Collection("slides");
Config = new Meteor.Collection("config");

// Publish complete set of lists to all clients.
Meteor.publish('slides', function () {
  return Slides.find({}, {sort: {ind:1}});
});

Meteor.publish('config', function () {
  return Config.find();
})

Meteor.startup(function () {
  if (Slides.find().count() === 0) {
    var data = [
      {text: "Busy as all hell!"},
      {text: "Just chillin like a villain."},
      {text: "Back after these messages."},
      {text: "Why can't things just be easy?"}
    ];

    for (var i=0; i < data.length; i++) {
      Slides.insert({text: data[i].text});
    }
  }

  if (Config.find().count() === 0) {
    Config.insert({n:5});
    // Config.insert({currentSlide: 0});
  }
});

Meteor.methods({
  revealReset: function () {
    Config.remove({});
    Config.insert({n:3});
  },
  moveSlide: function (sourceIndex, targetIndex) {
    var id = Slides.findOne({ind:sourceIndex})._id;
    var movinUp = targetIndex > sourceIndex;
    shift = movinUp ? -1 : 1;
    lowerIndex = Math.min(sourceIndex, targetIndex);
    lowerIndex += movinUp ? 1 : 0;
    upperIndex = Math.max(sourceIndex, targetIndex);
    upperIndex -= movinUp ? 0 : 1;
    console.log("Shifting slides from "+lowerIndex+" to "+upperIndex+" by "+shift+".");
    Slides.update({ind: {$gte: lowerIndex,$lte: upperIndex}}, {$inc: {ind:shift}},{multi:true});
    Slides.update(id, {$set: {ind:targetIndex}});
  }
});
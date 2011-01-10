var numCreeps, spawnCreeps, spawnCreepsEvent, spawnFish, spawnScorpion, spawnSnake, timeline, wave;
/*
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Setup game events
*/
numCreeps = 5;
wave = 0;
timeline = new Timeline();
spawnScorpion = function(time) {
  return level.creatures.addCreature(Scorpion);
};
spawnFish = function(time) {
  return level.creatures.addCreature(Fish);
};
spawnSnake = function(time) {
  return level.creatures.addCreature(Snake);
};
spawnCreepsEvent = function(time) {
  var creepType;
  creepType = spawnScorpion;
  if (wave % 3 === 1) {
    creepType = spawnFish;
  } else if (wave % 3 === 2) {
    creepType = spawnSnake;
  }
  spawnCreeps(time, numCreeps, creepType);
  wave++;
  if (wave % 2 === 0) {
    numCreeps++;
  }
  return timeline.addEvent(1.0 + 15.0 * wave, spawnCreepsEvent);
};
spawnCreeps = function(time, num, type) {
  var i;
  for (i = 0; (0 <= num ? i <= num : i >= num); (0 <= num ? i += 1 : i -= 1)) {
    timeline.addEvent(time + i * 0.25, type);
  }
  return null;
};
timeline.addEvent(1.0, spawnCreepsEvent);
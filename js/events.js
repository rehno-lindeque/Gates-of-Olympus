var spawnScorpions, timeline;
/*
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Setup game events
*/
timeline = new Timeline();
spawnScorpions = function(time) {
  level.creatures.addCreature(Scorpion);
  return null;
};
timeline.addEvent(2.0, spawnScorpions);
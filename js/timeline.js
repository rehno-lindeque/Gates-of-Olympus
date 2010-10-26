var Timeline;
/*
Gates of Olympus (A multi-layer Tower Defense game...)
Copyright 2010, Rehno Lindeque.

* Please visit http://gatesofolympus.com/.
* This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
Timeline = function() {
  this.events = new Array();
  this.time = 0.0;
  this.index = 0;
  null;
  return this;
};
Timeline.prototype.addEvent = function(time, handler) {
  this.events[this.events.length] = [time, handler];
  return null;
};
Timeline.prototype.update = function(time) {
  this.time = time;
  while (this.index < this.events.length && (this.events[this.index][0] <= this.time)) {
    this.events[this.index][1](this.time);
    this.index = this.index + 1;
  }
  return null;
};
Timeline.prototype.isFinished = function() {
  this.time > 0 && events.length === 0;
  return null;
};
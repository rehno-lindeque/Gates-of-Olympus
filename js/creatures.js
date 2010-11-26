var Creature, Creatures, Scorpion;
var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Creature types
*/
Creature = function() {};
Creature.prototype.create = function() {
  this.pos = [0.0, 0.0, platformHeights[0] - 1.75];
  this.rot = 0.0;
  this.level = 1;
  this.health = 0;
  return null;
};
Scorpion = function() {
  this.create();
  return this;
};
__extends(Scorpion, Creature);
Scorpion.prototype.create = function() {
  return Scorpion.__super__.create.call(this);
};
/*
Collection of all creatures
*/
Creatures = function() {
  SceneJS.createNode(BlenderExport.Scorpion);
  this.creatures = new Array();
  this.node = {
    type: "material",
    id: "creatures",
    baseColor: {
      r: 0.3,
      g: 0.1,
      b: 0.1
    },
    specularColor: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    specular: 0.0,
    shine: 0.0
  };
  return this;
};
Creatures.prototype.addCreature = function(CreaturePrototype) {
  var creature;
  creature = new CreaturePrototype();
  this.creatures[this.creatures.length] = creature;
  SceneJS.withNode("creatures").add("nodes", [
    {
      type: "translate",
      x: creature.pos[0],
      y: creature.pos[1],
      z: creature.pos[2],
      nodes: [
        {
          type: "rotate",
          angle: 0.0,
          z: 1.0,
          nodes: [
            {
              type: "instance",
              target: "Scorpion"
            }
          ]
        }
      ]
    }
  ]);
  return creature;
};
Creatures.prototype.update = function() {
  var c, creatures, goal, index, resetPos, start, vel, x, y;
  c = 0;
  creatures = this.creatures;
  floodInit();
  start = 6 + 6 * gridSize;
  goal = 6 + 11 * gridSize;
  x = creatures[c].pos[0];
  y = creatures[c].pos[1];
  index = positionToIndex(x, y);
  if (dirtyLevel[creatures[c].level]) {
    floodFill(goal);
  }
  if (index !== goal) {
    vel = getMove(creatures[c].pos[0], creatures[c].pos[1], goal);
    if (!(typeof vel !== "undefined" && vel !== null) || dirtyLevel[creatures[c].level]) {
      floodFillGenPath(index, goal);
      vel = getMove(creatures[c].pos[0], creatures[c].pos[1], goal);
    }
    creatures[c].pos[0] = x + vel.x * 0.1;
    creatures[c].pos[1] = y + vel.y * 0.1;
    creatures[c].rot = 180 * Math.atan2(vel.y, vel.x) / Math.PI - 90;
  } else {
    resetPos = indexToPosition(6, 6);
    creatures[c].pos[0] = resetPos.x;
    creatures[c].pos[1] = resetPos.y;
  }
  SceneJS.withNode("creatures").eachNode(function() {
    this.set({
      x: creatures[c].pos[0],
      y: creatures[c].pos[1],
      z: creatures[c].pos[2]
    });
    return this.node(0).set("angle", creatures[c].rot);
  }, {});
  return null;
};
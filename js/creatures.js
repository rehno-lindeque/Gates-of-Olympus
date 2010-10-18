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
  this.pos = [0, 0, 0];
  this.rot = 0;
  this.node = null;
  return (this.health = 0);
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
  this.creatures = new Array();
  this.geometries = new Array();
  this.geometries[0] = BlenderExport.Scorpion();
  this.node = SceneJS.createNode({
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
  });
  return this;
};
Creatures.prototype.addCreature = function(CreaturePrototype) {
  var creature;
  creature = new CreaturePrototype();
  this.creatures[this.creatures.length] = creature;
  SceneJS.fireEvent("configure", "creatures", {
    cfg: {
      "+node": {
        type: "translate",
        x: creature.pos[0],
        y: creature.pos[1],
        z: creature.pos[2],
        nodes: [
          {
            type: "rotate",
            angle: 0,
            z: 1,
            nodes: [
              {
                type: "instance",
                target: "Scorpion"
              }
            ]
          }
        ]
      }
    }
  });
  return creature;
};
Creatures.prototype.update = function() {
  var _i, _len, _ref, c, node;
  c = 0;
  _ref = SceneJS.getNode("creatures").getNodes();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    node = _ref[_i];
    node.setXYZ({
      x: this.creatures[c].pos[0],
      y: this.creatures[c].pos[1],
      z: this.creatures[c].pos[2]
    });
    node.getNodeAt(0).setAngle(this.creatures[c].rot);
    c += 1;
  }
  return null;
};
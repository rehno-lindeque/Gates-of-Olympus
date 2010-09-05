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
  this.position = [1.0, 0.0, 0.0];
  this.rotation = 0;
  this.angle = 0;
  this.node = null;
  return (this.health = 0);
};
Scorpion = function() {
  this.create();
  return this;
};
__extends(Scorpion, Creature);
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
    cfg: {
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
    }
  });
  return this;
};
Creatures.prototype.addCreature = function(CreaturePrototype) {
  var creature;
  creature = new CreaturePrototype();
  this.creatures[this.creatures.length] = creature;
  SceneJS.fireEvent("configure", "creatures", {
    cfg: {
      baseColor: {
        r: 0.4,
        g: 0.2,
        b: 0.2
      },
      specularColor: {
        r: 1.0,
        g: 1.0,
        b: 1.0
      },
      specular: 0.0,
      shine: 0.0
    },
    cfg: {
      "+node": {
        type: "translate",
        nodes: [
          {
            type: "instance",
            cfg: {
              target: "Scorpion"
            }
          }
        ]
      }
    }
  });
  return creature;
};
Creatures.prototype.update = function() {
  var _a, _b, _c, _d, c, node;
  c = 0;
  _a = []; _c = SceneJS.getNode("creatures").getNodes();
  for (_b = 0, _d = _c.length; _b < _d; _b++) {
    node = _c[_b];
    _a.push((function() {
      node.setXYZ(this.creatures[c].position[0], this.creatures[c].position[1], this.creatures[c].position[2]);
      return c += 1;
    }).call(this));
  }
  return _a;
};
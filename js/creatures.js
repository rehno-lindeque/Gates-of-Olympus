var Creature, Creatures, Fish, Scorpion;
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
  this.pos = [0.0, 0.0, 0.0];
  this.rot = 0.0;
  this.level = 0;
  this.index = 6 + 6 * gridSize;
  this.health = 0;
  return null;
};
Creature.prototype.getId = function() {
  return creatureIds[this.index];
};
Creature.prototype.getTextureURI = function() {
  return creatureTextureURI[this.index];
};
Scorpion = function() {
  this.create();
  this.index = 0;
  return this;
};
__extends(Scorpion, Creature);
Scorpion.prototype.create = function() {
  return Scorpion.__super__.create.call(this);
};
Fish = function() {
  this.create();
  this.index = 1;
  return this;
};
__extends(Fish, Creature);
Fish.prototype.create = function() {
  return Fish.__super__.create.call(this);
};
/*
Collection of all creatures
*/
Creatures = function() {
  this.creatures = new Array();
  SceneJS.createNode(BlenderExport.Scorpion);
  SceneJS.createNode(BlenderExport.Fish);
  this.node = {
    type: "material",
    id: "creatures",
    baseColor: {
      r: 0.0,
      g: 0.0,
      b: 0.0
    },
    specularColor: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    specular: 0.0,
    shine: 0.0,
    nodes: [
      {
        type: "texture",
        id: creatureIds[0] + "tex",
        layers: [
          {
            uri: creatureTextureURI[0]
          }
        ]
      }, {
        type: "texture",
        id: creatureIds[1] + "tex",
        layers: [
          {
            uri: creatureTextureURI[1]
          }
        ]
      }
    ]
  };
  return this;
};
Creatures.prototype.addCreature = function(CreaturePrototype) {
  var creature;
  creature = new CreaturePrototype();
  this.creatures[this.creatures.length] = creature;
  SceneJS.withNode("creatures").node(creature.index).add("nodes", [
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
              target: creature.getId()
            }
          ]
        }
      ]
    }
  ]);
  return creature;
};
Creatures.prototype.update = function() {
  var c, creatures;
  c = 0;
  creatures = this.creatures;
  /*
  floodInit()
  start = 6+ 0*gridSize
  goal  = 6+ 11*gridSize
  x = creatures[c].pos[0]
  y = creatures[c].pos[1]
  index = positionToIndex(x,y)
  creatures[c].index = index

  if (index != goal)

    vel = getMove(creatures[c].pos[0],creatures[c].pos[1],creatures[c].level)

    #if (!vel? || dirtyLevel[creatures[c].level])
    #  floodFillGenPath(index,goal)
    #  vel = getMove(creatures[c].pos[0],creatures[c].pos[1], goal)

    creatures[c].pos[0] = x + vel.x*0.1
    creatures[c].pos[1] = y + vel.y*0.1
    creatures[c].rot = 180*Math.atan2(vel.y,vel.x)/Math.PI - 90
  else
    resetPos = indexToPosition(6,1)
    creatures[c].pos[0] = resetPos.x
    creatures[c].pos[1] = resetPos.y
    creatures[c].level  = 0
    creatures[c].pos[2] = platformHeights[creatures[c].level] - 1.75
    creatures[c].index = positionToIndex(resetPos.x,resetPos.y)
    dirtyLevel[0] = true  # temp hack
  */
  SceneJS.withNode("creatures").eachNode(function() {
    return this.eachNode(function() {
      this.set({
        x: creatures[c].pos[0],
        y: creatures[c].pos[1],
        z: creatures[c].pos[2]
      });
      return this.node(0).set("angle", creatures[c].rot);
    }, {});
  }, {});
  return null;
};
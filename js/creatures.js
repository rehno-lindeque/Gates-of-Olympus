var Creature, Creatures, Fish, Scorpion, Snake;
var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
/*
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Creature types
*/
/*
creatureMaxHP = new Array(numCreatureTypes)
creatureMaxHP[0] = 120
creatureMaxHP[1] = 80
creatureMaxHP[2] = 100
*/
Creature = function() {};
Creature.prototype.create = function() {
  this.pos = [0.0, 0.0, platformHeights[0] + 10.0];
  this.rot = 0.0;
  this.level = 0;
  this.gridIndex = 11 + 11 * gridSize;
  this.maxHealth = 100;
  this.health = 100;
  this.state = 0;
  this.speed = 0.1;
  this.fallVelocity = [0.0, 0.0, -this.speed];
  return null;
};
Creature.prototype.getId = function() {
  return creatureIds[this.index];
};
Creature.prototype.getTextureURI = function() {
  return creatureTextureURI[this.index];
};
Creature.prototype.getGridIndex = function() {
  var index;
  index = positionToIndex(this.pos[0], this.pos[1], this.level);
  this.gridIndex = index;
  return index;
};
Creature.prototype.update = function() {
  var index, tmp, vel;
  if (this.state === 0) {
    this.pos[0] += this.fallVelocity[0];
    this.pos[1] += this.fallVelocity[1];
    this.pos[2] += this.fallVelocity[2];
    if (this.pos[2] < (platformHeights[this.level] - platformHeightOffset + 0.1)) {
      this.state = 1;
    }
  } else if (this.state === 1) {
    tmp = 1;
    if (this.gridIndex !== levelGoals[this.level]) {
      vel = getMove(this.pos[0], this.pos[1], this.level);
      this.pos[0] = this.pos[0] + vel.x * this.speed;
      this.pos[1] = this.pos[1] + vel.y * this.speed;
      this.rot = 180 * Math.atan2(vel.y, vel.x) / Math.PI - 90;
    } else {
      if (this.level === 2) {
        this.state = 2;
      } else {
        this.state = 0;
        this.level++;
        /*
        cellX = Math.floor(@gridIndex % gridSize)
        cellY = Math.floor(@gridIndex / gridSize) % gridSize
        g = indexToPosition(cellX, cellY, @level)
        dist = (platformHeights[@level] - platformHeightOffset + 0.1) - (platformHeights[@level-1] - platformHeightOffset + 0.1)
        dist = Math.abs(dist)
        fallTime = dist/@speed
        @fallVelocity.x = (g.x - @pos[0]) / fallTime
        @fallVelocity.y = (g.y - @pos[1]) / fallTime
        */
        this.fallVelocity.z = -this.speed;
      }
    }
  }
  index = positionToIndex(this.pos[0], this.pos[1], this.level);
  return (this.gridIndex = index);
};
Scorpion = function() {
  this.create();
  this.maxHealth = 100;
  this.health = this.maxHealth;
  this.speed = 0.02;
  this.index = 0;
  return this;
};
__extends(Scorpion, Creature);
Scorpion.prototype.create = function() {
  return Scorpion.__super__.create.call(this);
};
Fish = function() {
  this.create();
  this.maxHealth = 80;
  this.health = this.maxHealth;
  this.speed = 0.04;
  this.index = 1;
  return this;
};
__extends(Fish, Creature);
Fish.prototype.create = function() {
  return Fish.__super__.create.call(this);
};
Snake = function() {
  this.create();
  this.maxHealth = 120;
  this.health = this.maxHealth;
  this.speed = 0.06;
  this.index = 2;
  return this;
};
__extends(Snake, Creature);
Snake.prototype.create = function() {
  return Snake.__super__.create.call(this);
};
/*
Collection of all creatures
*/
Creatures = function() {
  this.creatures = new Array();
  SceneJS.createNode(BlenderExport.Scorpion);
  SceneJS.createNode(BlenderExport.Fish);
  SceneJS.createNode(BlenderExport.Snake);
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
      }, {
        type: "texture",
        id: creatureIds[2] + "tex",
        layers: [
          {
            uri: creatureTextureURI[2]
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
  return SceneJS.withNode("creatures").node(creature.index).add("nodes", [
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
            }, {
              type: "translate",
              y: 1.0,
              nodes: [
                {
                  type: "billboard",
                  id: "hpBar",
                  nodes: [
                    {
                      type: "texture"
                      /*
                      nodes: [
                        type: "geometry",
                        resource: "bill",
                        primitive: "triangles",
                        positions : [
                          -0.5, 0.1, 0,
                          -0.5, -0.1, 0,
                          0.5,-0.1, 0,
                          0.5,0.1, 0
                        ],
                        normals : [
                          0, 1, 0,
                          0, 1, 0,
                          0, 1, 0,
                          0, 1, 0
                        ],
                        uv : [
                          0, 1,
                          0, 0,
                          1, 0,
                          1, 1
                        ],
                        indices : [
                          0, 1, 2,
                          0, 2, 3
                        ]
                      ]
                      */
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]);
};
Creatures.prototype.update = function() {
  var _a, _b, _c, c, creature, creatures;
  c = 0;
  creatures = this.creatures;
  _b = creatures;
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    creature = _b[_a];
    creature.update();
  }
  SceneJS.withNode("creatures").eachNode(function() {
    this.eachNode(function() {
      this.set({
        x: creatures[c].pos[0],
        y: creatures[c].pos[1],
        z: creatures[c].pos[2]
      });
      return this.node(0).set("angle", creatures[c].rot);
    }, {});
    return {
      todo: c += 1
    };
  }, {});
  return null;
};
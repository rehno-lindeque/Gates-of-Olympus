/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/var Skybox;
/*
A proxy for the skybox
*/
Skybox = function() {
  this.node = {
    type: "scale",
    x: 100.0,
    y: 100.0,
    z: 100.0,
    nodes: [
      {
        type: "material",
        baseColor: {
          r: 1.0,
          g: 1.0,
          b: 1.0
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
            layers: [
              {
                uri: "textures/sky.png"
              }
            ],
            nodes: [
              {
                type: "geometry",
                primitive: "triangles",
                positions: [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1],
                uv: [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
                indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
              }
            ]
          }
        ]
      }
    ]
  };
  return this;
};var Level, towerNode, towerPlacementNode;
/*
Tower scene graph nodes
*/
towerNode = function(index, sid) {
  return {
    type: "material",
    baseColor: {
      r: 1.0,
      g: 1.0,
      b: 1.0
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
        layers: [
          {
            uri: towerTextureURI[index]
          }
        ]
      }
    ]
  };
};
towerPlacementNode = function() {
  return {
    type: "translate",
    id: "placementTower",
    z: platformHeights[1],
    nodes: [
      {
        type: "selector",
        id: "placementTowerModel",
        selection: [0],
        nodes: [
          addChildren(towerNode(0, "placementTower" + 0), {
            type: "instance",
            target: towerIds[0]
          }), addChildren(towerNode(1, "placementTower" + 1), {
            type: "instance",
            target: towerIds[1]
          })
        ]
      }
    ]
  };
};
/*
A proxy for the whole level with platforms and creatures etc.
*/
Level = function() {
  var _ref, c;
  this.creatures = new Creatures();
  this.towerNodes = [
    {
      archerTowers: towerNode(0, "archerTowers0"),
      catapultTowers: towerNode(1, "catapultTowers0")
    }, {
      archerTowers: towerNode(0, "archerTowers1"),
      catapultTowers: towerNode(1, "catapultTowers1")
    }, {
      archerTowers: towerNode(0, "archerTowers2"),
      catapultTowers: towerNode(1, "catapultTowers2")
    }
  ];
  this.towers = new Array(sqrGridSize * levels);
  _ref = (sqrGridSize * levels);
  for (c = 0; (0 <= _ref ? c < _ref : c > _ref); (0 <= _ref ? c += 1 : c -= 1)) {
    this.towers[c] = -1;
  }
  this.node = this.createNode();
  return this;
};
Level.prototype.getTowerRoot = function(level, towerType) {
  switch (towerType) {
    case 0:
      return this.towerNodes[level].archerTowers;
    case 1:
      return this.towerNodes[level].catapultTowers;
    default:
      return null;
  }
};
Level.prototype.addTower = function(towerPlacement, towerType) {
  var cx, cy, cz, index, node, parentNode;
  index = towerPlacement.level * sqrGridSize + towerPlacement.cell.y * gridSize + towerPlacement.cell.x;
  if (this.towers[index] === -1) {
    this.towers[index] = towerType;
    parentNode = this.getTowerRoot(towerPlacement.level, towerType);
    node = {
      type: "instance",
      target: towerIds[towerType]
    };
    cx = towerPlacement.cell.x;
    cy = towerPlacement.cell.y;
    cz = towerPlacement.level;
    parentNode.addNode(SceneJS.translate({
      x: cellScale * (cx - gridSize / 2) + cellScale * 0.5,
      y: cellScale * (cy - gridSize / 2) + cellScale * 0.5
    }, node));
  }
  return null;
};
Level.prototype.createTowers = function(towers) {
  var cx, cy, cz, node, parentNode, t;
  for (cz = 0; (0 <= levels ? cz < levels : cz > levels); (0 <= levels ? cz += 1 : cz -= 1)) {
    for (cy = 0; (0 <= gridSize ? cy < gridSize : cy > gridSize); (0 <= gridSize ? cy += 1 : cy -= 1)) {
      for (cx = 0; (0 <= gridSize ? cx < gridSize : cx > gridSize); (0 <= gridSize ? cx += 1 : cx -= 1)) {
        t = towers[cz * sqrGridSize + cy * gridSize + cx];
        if (t !== -1) {
          switch (t) {
            case 0:
              node = SceneJS.instance({
                target: towerIds[0]
              });
              parentNode = this.towerNodes[cz].archerTowers;
              break;
            case 1:
              node = SceneJS.instance({
                target: towerIds[1]
              });
              parentNode = this.towerNodes[cz].catapultTowers;
              break;
          }
          parentNode.addNode(SceneJS.translate({
            x: cellScale * (cx - gridSize / 2) + cellScale * 0.5,
            y: cellScale * (cy - gridSize / 2) + cellScale * 0.5
          }, node));
        }
      }
    }
  }
  return null;
};
Level.prototype.update = function() {
  return this.creatures.update();
};
Level.prototype.createNode = function() {
  return {
    type: "material",
    baseColor: {
      r: 0.75,
      g: 0.78,
      b: 0.85
    },
    specularColor: {
      r: 0.9,
      g: 0.9,
      b: 0.9
    },
    specular: 0.9,
    shine: 6.0,
    nodes: [
      {
        type: "translate",
        z: platformHeights[1],
        nodes: [this.creatures.node]
      }, towerPlacementNode(), this.createPlatformNode(0), this.createPlatformNode(1), this.createPlatformNode(2)
    ]
  };
};
Level.prototype.createPlatformNode = function(k) {
  return {
    type: "translate",
    z: platformHeights[k],
    nodes: [
      {
        type: "scale",
        x: 0.78,
        y: 0.78,
        z: 0.78,
        nodes: [platformGeometry("level" + k), this.towerNodes[k].archerTowers, this.towerNodes[k].catapultTowers]
      }
    ]
  };
};var LevelCamera;
/*
The camera proxy
*/
LevelCamera = function(levelNode) {
  this.optics = {
    type: "ortho",
    left: -12.5 * (canvasSize[0] / canvasSize[1]),
    right: 12.5 * (canvasSize[0] / canvasSize[1]),
    bottom: -12.5,
    top: 12.5,
    near: 0.1,
    far: 300.0
  };
  this.node = {
    type: "camera",
    id: "sceneCamera",
    optics: this.optics,
    nodes: [
      {
        type: "light",
        mode: "dir",
        color: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        diffuse: true,
        specular: false,
        dir: {
          x: 1.0,
          y: 1.0,
          z: -1.0
        }
      }, levelNode
    ]
  };
  return this;
};
LevelCamera.prototype.withCamera = function() {
  return SceneJS.withNode("sceneCamera");
};
LevelCamera.prototype.reconfigure = function() {
  return this.withCamera().set("optics", this.optics);
};var LevelLookAt;
/*
The look-at proxy for the main game scene
*/
LevelLookAt = function(cameraNode, backgroundCameraNode) {
  this.angle = 0.0;
  this.radius = 10.0;
  this.lookAtNode = {
    type: "lookAt",
    id: "SceneLookAt",
    eye: {
      x: 0.0,
      y: -this.radius,
      z: 7.0
    },
    look: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    up: {
      x: 0.0,
      y: 0.0,
      z: 1.0
    },
    nodes: [cameraNode]
  };
  this.backgroundLookAtNode = {
    type: "lookAt",
    id: "BackgroundLookAt",
    eye: {
      x: 0.0,
      y: -this.radius,
      z: 7.0
    },
    look: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    up: {
      x: 0.0,
      y: 0.0,
      z: 1.0
    },
    nodes: [backgroundCameraNode]
  };
  this.node = {
    type: "translate",
    x: gameSceneOffset[0],
    y: gameSceneOffset[1],
    z: gameSceneOffset[2],
    nodes: [this.lookAtNode]
  };
  return this;
};
LevelLookAt.prototype.withSceneLookAt = function() {
  return SceneJS.withNode("SceneLookAt");
};
LevelLookAt.prototype.withBackgroundLookAt = function() {
  return SceneJS.withNode("BackgroundLookAt");
};
LevelLookAt.prototype.update = function() {
  var cosAngle, eyeCfg;
  cosAngle = Math.cos(this.angle);
  eyeCfg = {
    x: (Math.sin(this.angle)) * this.radius,
    y: cosAngle * -this.radius,
    z: 7.0
  };
  this.withSceneLookAt().set("eye", eyeCfg);
  return this.withBackgroundLookAt().set("eye", eyeCfg);
};var GUIDais, guiDaisNode;
/*
A proxy for dias tower selection gui element
*/
guiDaisNode = function(id, index) {
  return {
    type: "translate",
    id: id,
    x: index * 1.5,
    nodes: [
      {
        type: "rotate",
        sid: "rotZ",
        angle: guiDiasRotPosition[index * 2],
        z: 1.0,
        nodes: [
          {
            type: "rotate",
            sid: "rotX",
            angle: guiDiasRotPosition[index * 2],
            x: 1.0,
            nodes: [
              {
                type: "instance",
                target: "NumberedDais"
              }, {
                type: "texture",
                layers: [
                  {
                    uri: towerTextureURI[index]
                  }
                ],
                nodes: [
                  {
                    type: "instance",
                    target: towerIds[index]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
};
GUIDais = function(index) {
  this.index = index;
  this.id = "dais" + index;
  this.node = guiDaisNode(this.id, index);
  return this;
};
GUIDais.prototype.update = function() {
  return SceneJS.withNode(this.id).node(0).set({
    angle: guiDiasRotPosition[this.index * 2],
    z: 1.0
  });
};var GUI;
/*
Top level GUI container
*/
GUI = function() {
  this.daises = new Array(2);
  this.daises[0] = new GUIDais(0);
  this.daises[1] = new GUIDais(1);
  this.daisGeometry = SceneJS.createNode(BlenderExport.NumberedDais);
  this.lightNode = {
    type: "light",
    mode: "dir",
    color: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    diffuse: true,
    specular: false,
    dir: {
      x: 1.0,
      y: 1.0,
      z: -1.0
    }
  };
  this.lookAtNode = {
    type: "lookAt",
    eye: {
      x: 0.0,
      y: -10.0,
      z: 4.0
    },
    look: {
      x: 0.0,
      y: 0.0
    },
    up: {
      z: 1.0
    }
  };
  this.node = {
    type: "translate",
    x: 8.0,
    y: 4.0,
    nodes: [
      {
        type: "material",
        baseColor: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        specularColor: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        specular: 0.0,
        shine: 0.0
      }, this.daises[0].node, this.daises[1].node
    ]
  };
  return this;
};
GUI.prototype.update = function() {
  this.daises[0].update();
  return this.daises[1].update();
};var GUICamera;
GUICamera = function(gui, referenceCamera) {
  this.referenceCamera = referenceCamera;
  this.node = {
    type: "camera",
    optics: levelCamera.optics,
    nodes: [gui.lightNode, gui.node]
  };
  return this;
};
GUICamera.prototype.reconfigure = function() {
  return this.node ? this.node.setOptics(this.referenceCamera.config.optics) : null;
};var BackgroundCamera;
/*
Background proxies
*/
BackgroundCamera = function(backgroundNode) {
  this.optics = {
    type: "perspective",
    fovy: 25.0,
    aspect: canvasSize[0] / canvasSize[1],
    near: 0.10,
    far: 300.0
  };
  this.node = {
    type: "camera",
    id: "backgroundCamera",
    optics: this.optics,
    nodes: [
      {
        type: "stationary",
        nodes: [backgroundNode]
      }
    ]
  };
  return this;
};
BackgroundCamera.prototype.withNode = function() {
  return SceneJS.withNode("backgroundCamera");
};
BackgroundCamera.prototype.reconfigure = function() {
  return this.withNode().set("optics", this.optics);
};
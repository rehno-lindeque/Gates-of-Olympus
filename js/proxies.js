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
        sid: "placementTowerModel",
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
  this.node = {
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
      }, towerPlacementNode(), {
        type: "translate",
        z: platformHeights[0],
        nodes: [
          {
            type: "scale",
            x: 0.78,
            y: 0.78,
            z: 0.78,
            nodes: [platformGeometry("level0"), this.towerNodes[0].archerTowers, this.towerNodes[0].catapultTowers]
          }
        ]
      }, {
        type: "translate",
        z: platformHeights[1],
        nodes: [platformGeometry("level1"), this.towerNodes[1].archerTowers, this.towerNodes[1].catapultTowers],
        type: "translate",
        z: platformHeights[2],
        nodes: [
          {
            type: "scale",
            x: 1.22,
            y: 1.22,
            z: 1.22,
            nodes: [platformGeometry("level2"), this.towerNodes[2].archerTowers, this.towerNodes[2].catapultTowers]
          }
        ]
      }
    ]
  };
  return this;
};
({
  getTowerRoot: function(level, towerType) {
    switch (towerType) {
      case 0:
        return this.towerNodes[level].archerTowers;
      case 1:
        return this.towerNodes[level].catapultTowers;
      default:
        return null;
    }
  },
  addTower: function(towerPlacement, towerType) {
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
      return parentNode.addNode(SceneJS.translate({
        x: cellScale * (cx - gridSize / 2) + cellScale * 0.5,
        y: cellScale * (cy - gridSize / 2) + cellScale * 0.5
      }, node));
    }
  },
  createTowers: function(towers) {
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
  },
  update: function() {
    return this.creatures.update();
  }
});var LevelCamera;
/*
The camera proxy
*/
LevelCamera = function(levelNode) {
  this.reconfigure();
  this.node = {
    type: "camera",
    optics: {
      type: "ortho",
      left: -12.5 * (canvasSize[0] / canvasSize[1]),
      right: 12.5 * (canvasSize[0] / canvasSize[1]),
      bottom: -12.5,
      top: 12.5,
      near: 0.1,
      far: 300.0
    },
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
LevelCamera.prototype.reconfigure = function() {};var LevelLookAt;
/*
The look-at proxy for the main game scene
*/
LevelLookAt = function(cameraNode, backgroundCameraNode) {
  this.angle = 0.0;
  this.radius = 10.0;
  this.config = {
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
    }
  };
  this.lookAtNode = SceneJS.lookAt(this.config, cameraNode);
  this.backgroundLookAtNode = SceneJS.lookAt(this.config, backgroundCameraNode);
  this.node = SceneJS.translate({
    x: gameSceneOffset[0],
    y: gameSceneOffset[1],
    z: gameSceneOffset[2]
  }, this.lookAtNode);
  return this;
};
LevelLookAt.prototype.update = function() {
  var cfg, cosAngle;
  cosAngle = Math.cos(this.angle);
  cfg = {
    x: (Math.sin(this.angle)) * this.radius,
    y: cosAngle * -this.radius,
    z: 7.0
  };
  this.lookAtNode.setEye(cfg);
  return this.backgroundLookAtNode.setEye(cfg);
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
  return SceneJS.fireEvent("configure", this.id, {
    cfg: {
      "#rotZ": {
        angle: guiDiasRotPosition[this.index * 2],
        z: 1.0,
        "#rotX": {
          angle: guiDiasRotPosition[this.index * 2 + 1],
          x: 1.0
        }
      }
    }
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
  this.lightConfig = {
    type: "dir",
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
  this.lookAt = {
    type: "lookat",
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
  this.node = SceneJS.camera(levelCamera.config, SceneJS.light(gui.lightConfig), gui.node);
  return this;
};
GUICamera.prototype.reconfigure = function() {
  return this.node ? this.node.setOptics(this.referenceCamera.config.optics) : null;
};var BackgroundCamera;
/*
Background proxies
*/
BackgroundCamera = function(backgroundNode) {
  this.reconfigure();
  this.node = SceneJS.camera(this.config, SceneJS.cloudDome({
    radius: 100.0
  }, SceneJS.stationary(backgroundNode)));
  return this;
};
BackgroundCamera.prototype.reconfigure = function() {
  this.config = {
    optics: {
      type: "perspective",
      fovy: 25.0,
      aspect: canvasSize[0] / canvasSize[1],
      near: 0.10,
      far: 300.0
    }
  };
  return this.node ? this.node.setOptics(this.config.optics) : null;
};
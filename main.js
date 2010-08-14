(function() {
  var _a, archerTowersNode, c, cameraConfig, canvas, catapultTowersNode, cellScale, createTowers, currentTowerSelection, dragging, gameScene, gridSize, guiNode, handleKeyDown, interval, lastX, lastY, levelNodes, levels, lightConfig, lookAtConfig, mouseDown, mouseMove, mouseUp, pitch, platformGeometry, platformsNode, skyboxNode, sqrGridSize, square, towers, yaw;
  /*
  Gates of Olympus (A multi-layer Tower Defense game...)
  Copyright 2010, Rehno Lindeque.

  * Please visit http://gatesofolympus.com/.
  * This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
  */
  /*
  Auxiliary functions
  */
  square = function(x) {
    return x * x;
  };
  /*
  Globals
  */
  gridSize = 12;
  sqrGridSize = square(gridSize);
  levels = 3;
  /*
  Tower definitions
  */
  archerTowersNode = function(sid) {
    return SceneJS.material({
      baseColor: {
        r: 0.37,
        g: 0.26,
        b: 0.115
      },
      specularColor: {
        r: 0.9,
        g: 0.9,
        b: 0.9
      },
      specular: 0.0,
      shine: 0.0
    });
  };
  catapultTowersNode = function(sid) {
    var tex;
    tex = SceneJS.texture({
      layers: [
        {
          uri: "textures/catapult.jpg"
        }
      ]
    });
    SceneJS.material({
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
    }, tex);
    return tex;
  };
  /*
  Level definitions
  */
  levelNodes = new Array(3);
  levelNodes[0] = {
    archerTowers: archerTowersNode("archerTowers0"),
    catapultTowers: catapultTowersNode("catapultTowers0")
  };
  levelNodes[1] = {
    archerTowers: archerTowersNode("archerTowers1"),
    catapultTowers: catapultTowersNode("catapultTowers1")
  };
  levelNodes[2] = {
    archerTowers: archerTowersNode("archerTowers2"),
    catapultTowers: catapultTowersNode("catapultTowers2")
  };
  cellScale = 3.0;
  platformGeometry = function(type) {
    var s;
    s = gridSize * cellScale * 0.5;
    return SceneJS.geometry({
      type: type,
      primitive: "triangles",
      positions: [-s, s, 0, s, s, 0, s, -s, 0, -s, -s, 0],
      indices: [0, 1, 2, 0, 2, 3]
    });
  };
  /*
  The main scene definition
  */
  cameraConfig = {
    optics: {
      type: "ortho",
      left: -10.0 * (1020.0 / 600.0),
      right: 10.0 * (1020.0 / 600.0),
      bottom: -10.0,
      top: 10.0,
      near: 0.1,
      far: 300.0
    }
  };
  lightConfig = {
    sources: [
      {
        type: "dir",
        color: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        diffuse: true,
        specular: true,
        dir: {
          x: 1.0,
          y: 1.0,
          z: -1.0
        }
      }
    ]
  };
  lookAtConfig = {
    eye: {
      x: 0.0,
      y: 10.0,
      z: 10.0
    },
    look: {
      x: 0.0,
      y: 0.0
    },
    up: {
      z: 1.0
    }
  };
  guiNode = SceneJS.translate({
    x: -8.0,
    y: -4.0
  }, SceneJS.scale({
    x: 0.1,
    y: 0.1,
    z: 0.1
  }, SceneJS.symbol({
    sid: "NumberedDais"
  }, BlenderExport.NumberedDais()), SceneJS.instance({
    uri: "NumberedDais"
  })));
  platformsNode = SceneJS.scale({
    x: 0.3,
    y: 0.3,
    z: 0.3
  }, SceneJS.material({
    baseColor: {
      r: 0.7,
      g: 0.7,
      b: 0.7
    },
    specularColor: {
      r: 0.9,
      g: 0.9,
      b: 0.9
    },
    specular: 0.9,
    shine: 6.0
  }, SceneJS.translate({
    z: 25
  }, SceneJS.scale({
    x: 0.75,
    y: 0.75,
    z: 0.75
  }, platformGeometry("level0"), levelNodes[0].archerTowers, levelNodes[0].catapultTowers)), SceneJS.scale({
    x: 0.875,
    y: 0.875,
    z: 0.875
  }, platformGeometry("level1"), levelNodes[1].archerTowers, levelNodes[1].catapultTowers), SceneJS.translate({
    z: -25
  }, platformGeometry("level2"), levelNodes[2].archerTowers, levelNodes[2].catapultTowers)));
  skyboxNode = SceneJS.scale({
    x: 100.0,
    y: 100.0,
    z: 100.0
  }, SceneJS.material({
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
    specular: 1.0,
    shine: 0.1
  }, SceneJS.texture({
    layers: [
      {
        uri: "textures/sky.jpg"
      }
    ]
  }, SceneJS.geometry({
    type: "Skybox",
    primitive: "triangles",
    positions: [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1],
    uv: [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
    indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
  }))));
  gameScene = SceneJS.scene({
    canvasId: "gameCanvas"
  }, SceneJS.lookAt(lookAtConfig, SceneJS.camera(cameraConfig, guiNode)), SceneJS.lights(lightConfig, SceneJS.lookAt(lookAtConfig, SceneJS.camera(cameraConfig, SceneJS.translate({
    x: 3.0
  }, SceneJS.rotate(function(data) {
    return {
      angle: data.get('pitch'),
      x: 1.0
    };
  }, SceneJS.rotate(function(data) {
    return {
      angle: data.get('yaw'),
      z: 1.0
    };
  }, SceneJS.symbol({
    sid: "ArcherTower"
  }, BlenderExport.ArcherTower()), SceneJS.symbol({
    sid: "CatapultTower"
  }, BlenderExport.CatapultTower()), platformsNode, SceneJS.stationary(skyboxNode))))))));
  /*
  Initialization and rendering loop
  */
  yaw = 0;
  pitch = 0;
  gameScene.setData({
    yaw: yaw,
    pitch: pitch
  }).render();
  canvas = document.getElementById(gameScene.getCanvasId());
  /*
  Game logic
  */
  currentTowerSelection = -1;
  towers = new Array((sqrGridSize * levels));
  _a = (sqrGridSize * levels);
  for (c = 0; (0 <= _a ? c < _a : c > _a); (0 <= _a ? c += 1 : c -= 1)) {
    towers[c] = 0;
  }
  towers[0] = 1;
  towers[1] = 1;
  towers[2] = 1;
  towers[3] = 2;
  towers[4] = 2;
  towers[5] = 2;
  towers[6] = 1;
  towers[7] = 2;
  towers[8] = 1;
  towers[9] = 1;
  towers[10] = 1;
  towers[11] = 1;
  towers[sqrGridSize + 0] = 1;
  towers[sqrGridSize + 1] = 2;
  towers[sqrGridSize + 2] = 1;
  towers[sqrGridSize + 3] = 1;
  towers[sqrGridSize + 4] = 1;
  towers[sqrGridSize + 5] = 2;
  towers[sqrGridSize + 6] = 1;
  towers[sqrGridSize + 7] = 2;
  towers[sqrGridSize + 8] = 1;
  towers[sqrGridSize + 9] = 1;
  towers[sqrGridSize + 10] = 1;
  towers[sqrGridSize + 11] = 1;
  towers[290] = 1;
  towers[291] = 1;
  towers[292] = 2;
  towers[293] = 1;
  towers[294] = 1;
  towers[295] = 1;
  towers[296] = 1;
  towers[297] = 2;
  towers[298] = 2;
  towers[299] = 1;
  createTowers = function(towers) {
    var ix, iy, iz, parentNode, t, towerNode;
    for (iz = 0; (0 <= levels ? iz < levels : iz > levels); (0 <= levels ? iz += 1 : iz -= 1)) {
      for (iy = 0; (0 <= gridSize ? iy < gridSize : iy > gridSize); (0 <= gridSize ? iy += 1 : iy -= 1)) {
        for (ix = 0; (0 <= gridSize ? ix < gridSize : ix > gridSize); (0 <= gridSize ? ix += 1 : ix -= 1)) {
          t = towers[iz * sqrGridSize + iy * gridSize + ix];
          if (t !== 0) {
            if (t === 1) {
              towerNode = SceneJS.instance({
                uri: "../ArcherTower"
              });
              parentNode = levelNodes[iz].archerTowers;
            } else if (t === 2) {
              towerNode = SceneJS.instance({
                uri: "../CatapultTower"
              });
              parentNode = levelNodes[iz].catapultTowers;
            } else {
              alert("" + (iz * sqrGridSize + iy * gridSize + ix) + " : " + t);
            }
            parentNode.addNode(SceneJS.translate({
              x: cellScale * (ix - gridSize / 2),
              y: cellScale * (iy - gridSize / 2)
            }, towerNode));
          }
        }
      }
    }
    return null;
  };
  createTowers(towers);
  /*
  User input
  */
  lastX = 0;
  lastY = 0;
  dragging = false;
  handleKeyDown = function(event) {
    var _b;
    if ((_b = String.fromCharCode(event.keyCode)) === 1) {
      return (currentTowerSelection = 1);
    } else if (_b === 2) {
      return (currentTowerSelection = 2);
    } else {
      return (currentTowerSelection = -1);
    }
  };
  mouseDown = function(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    return (dragging = true);
  };
  mouseUp = function() {
    return (dragging = false);
  };
  mouseMove = function(event) {
    if (dragging) {
      yaw += (event.clientX - lastX) * 0.5;
      pitch += (event.clientY - lastY) * -0.5;
      lastX = event.clientX;
      return (lastY = event.clientY);
    }
  };
  canvas.addEventListener('mousedown', mouseDown, true);
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mouseup', mouseUp, true);
  window.render = function() {
    return gameScene.setData({
      yaw: yaw,
      pitch: pitch
    }).render();
  };
  interval = window.setInterval("window.render()", 10);
})();

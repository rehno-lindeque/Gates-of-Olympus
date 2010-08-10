(function() {
  var archerTowersNode, c, canvas, catapultTowersNode, createTowers, currentTowerSelection, dragging, gameScene, handleKeyDown, lastX, lastY, levels, mouseDown, mouseMove, mouseUp, pitch, towers, yaw;
  /*
  Gates of Olympus (A multi-layer Tower Defense game...)
  Copyright 2010, Rehno Lindeque.

  * Please visit http://gatesofolympus.com/.
  * This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
  */
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
    }, SceneJS.node({
      sid: sid
    }));
  };
  catapultTowersNode = function(sid) {
    return SceneJS.material({
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
    }, SceneJS.texture({
      layers: [
        {
          uri: "http://scenejs.org/library/textures/stone/BrickWall.jpg"
        }
      ]
    }, SceneJS.node({
      sid: sid
    })));
  };
  /*
  Level definitions
  */
  levels = new Array(3);
  levels[0] = {
    archerTowers: archerTowersNode("archerTowers0"),
    catapultTowers: catapultTowersNode("catapultTowers0")
  };
  levels[1] = {
    archerTowers: archerTowersNode("archerTowers1"),
    catapultTowers: catapultTowersNode("catapultTowers1")
  };
  levels[2] = {
    archerTowers: archerTowersNode("archerTowers2"),
    catapultTowers: catapultTowersNode("catapultTowers2")
  };
  /*
  The main scene definition
  */
  gameScene = SceneJS.scene({
    canvasId: "gameCanvas"
  }, SceneJS.lights({
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
  }, SceneJS.lookAt({
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
  }, SceneJS.camera({
    optics: {
      type: "ortho",
      left: -10.0,
      right: 10.0,
      bottom: -10.0,
      top: 10.0,
      near: 0.1,
      far: 300.0
    }
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
  }, BlenderExport.CatapultTower()), SceneJS.scale({
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
  }, SceneJS.geometry({
    type: "plane0",
    primitive: "triangles",
    positions: [-15, 15, 0, 15, 15, 0, 15, -15, 0, -15, -15, 0],
    indices: [0, 1, 2, 0, 2, 3]
  }), levels[0].archerTowers, levels[0].catapultTowers)), SceneJS.scale({
    x: 0.875,
    y: 0.875,
    z: 0.875
  }, SceneJS.geometry({
    type: "plane1",
    primitive: "triangles",
    positions: [-15, 15, 0, 15, 15, 0, 15, -15, 0, -15, -15, 0],
    indices: [0, 1, 2, 0, 2, 3]
  }), levels[1].archerTowers, levels[1].catapultTowers), SceneJS.translate({
    z: -25
  }, SceneJS.geometry({
    type: "plane2",
    primitive: "triangles",
    positions: [-15, 15, 0, 15, 15, 0, 15, -15, 0, -15, -15, 0],
    indices: [0, 1, 2, 0, 2, 3]
  }), levels[2].archerTowers, levels[2].catapultTowers)))))))));
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
  towers = new Array(300);
  for (c = 0; c < 300; c++) {
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
  towers[190] = 1;
  towers[191] = 2;
  towers[192] = 1;
  towers[193] = 1;
  towers[194] = 1;
  towers[195] = 2;
  towers[196] = 1;
  towers[197] = 2;
  towers[198] = 1;
  towers[199] = 1;
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
    for (iz = 0; iz < 3; iz++) {
      for (iy = 0; iy < 10; iy++) {
        for (ix = 0; ix < 10; ix++) {
          t = towers[iz * 100 + iy * 10 + ix];
          if (t !== 0) {
            if (t === 1) {
              towerNode = SceneJS.instance({
                uri: "../ArcherTower"
              });
              parentNode = levels[iz].archerTowers;
            } else if (t === 2) {
              towerNode = SceneJS.instance({
                uri: "../CatapultTower"
              });
              parentNode = levels[iz].catapultTowers;
            } else {
              alert("" + (iz * 100 + iy * 10 + ix) + " : " + t);
            }
            parentNode.addNode(SceneJS.translate({
              x: 3.0 * (ix - 5),
              y: 3.0 * (iy - 5)
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
    var _a;
    if ((_a = String.fromCharCode(event.keyCode)) === 1) {
      return (currentTowerSelection = 1);
    } else if (_a === 2) {
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
      gameScene.setData({
        yaw: yaw,
        pitch: pitch
      }).render();
      lastX = event.clientX;
      return (lastY = event.clientY);
    }
  };
  canvas.addEventListener('mousedown', mouseDown, true);
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mouseup', mouseUp, true);
})();

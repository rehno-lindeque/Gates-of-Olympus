(function() {
  var _a, c, cameraConfig, canvas, canvasSize, cellScale, clamp, createTowers, currentTowerSelection, dragging, gameScene, gridSize, guiDiasRotPosition, guiDiasRotVelocity, guiLightsConfig, guiLookAtConfig, guiNode, intersectRayXYPlane, interval, keyDown, lastX, lastY, lerp, levelNodes, levels, max, min, mouseDown, mouseMove, mouseUp, numTowerTypes, numberedDaisNode, pitch, platformGeometry, platformHeights, platformLengths, platformsNode, sceneLightsConfig, sceneLookAtConfig, sceneLookAtNode, sceneLookAtURI, skyboxNode, sqrGridSize, square, towerNode, towerPlacement, towerPlacementNode, towerTextureURI, towerURI, towers, yaw;
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
  min = function(x, y) {
    return x < y ? x : y;
  };
  max = function(x, y) {
    return x > y ? x : y;
  };
  clamp = function(x, y, z) {
    return (x < y) ? y : (x > z ? z : x);
  };
  lerp = function(t, x, y) {
    return x * (1.0 - t) + y * t;
  };
  /*
  Globals
  */
  canvasSize = [1020.0, 800.0];
  gridSize = 12;
  sqrGridSize = square(gridSize);
  levels = 3;
  cellScale = 0.9;
  platformHeights = [cellScale * 10 + 1.15, 1.15, cellScale * -11 + 1.15];
  platformLengths = [0.78 * 0.5 * cellScale * 1.00 * 0.5 * cellScale * gridSize, 1.22 * 0.5 * cellScale * gridSize];
  numTowerTypes = 3;
  guiDiasRotVelocity = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  guiDiasRotPosition = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  towerPlacement = {
    level: -1,
    cell: {
      x: -1,
      y: -1
    }
  };
  /*
  Tower definitions
  */
  towerURI = ["../ArcherTower", "../CatapultTower", "../LightningTower"];
  towerTextureURI = ["textures/archer.jpg", "textures/catapult.jpg", "textures/lightning.jpg"];
  towerNode = function(index, sid) {
    var tex;
    tex = SceneJS.texture({
      layers: [
        {
          uri: towerTextureURI[index]
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
    archerTowers: towerNode(0, "archerTowers0"),
    catapultTowers: towerNode(1, "catapultTowers0")
  };
  levelNodes[1] = {
    archerTowers: towerNode(0, "archerTowers1"),
    catapultTowers: towerNode(1, "catapultTowers1")
  };
  levelNodes[2] = {
    archerTowers: towerNode(0, "archerTowers2"),
    catapultTowers: towerNode(1, "catapultTowers2")
  };
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
      left: -12.5 * (canvasSize[0] / canvasSize[1]),
      right: 12.5 * (canvasSize[0] / canvasSize[1]),
      bottom: -12.5,
      top: 12.5,
      near: 0.1,
      far: 300.0
    }
  };
  sceneLightsConfig = {
    sources: [
      {
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
      }
    ]
  };
  towerPlacementNode = function() {
    var tower1, tower2;
    tower1 = towerNode(0, "placementTower" + 0);
    tower1.addNode(SceneJS.instance({
      uri: towerURI[0]
    }));
    tower2 = towerNode(1, "placementTower" + 1);
    tower2.addNode(SceneJS.instance({
      uri: towerURI[1]
    }));
    return SceneJS.translate({
      id: "placementTower",
      z: platformHeights[1]
    }, SceneJS.selector({
      id: "placementTowerModel",
      selection: [0]
    }, tower1, tower2));
  };
  platformsNode = SceneJS.material({
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
    shine: 6.0
  }, towerPlacementNode(), SceneJS.translate({
    z: platformHeights[0]
  }, SceneJS.scale({
    x: 0.78,
    y: 0.78,
    z: 0.78
  }, platformGeometry("level0"), levelNodes[0].archerTowers, levelNodes[0].catapultTowers)), SceneJS.translate({
    z: platformHeights[1]
  }, platformGeometry("level1"), levelNodes[1].archerTowers, levelNodes[1].catapultTowers), SceneJS.translate({
    z: platformHeights[2]
  }, SceneJS.scale({
    x: 1.22,
    y: 1.22,
    z: 1.22
  }, platformGeometry("level2"), levelNodes[2].archerTowers, levelNodes[2].catapultTowers)));
  skyboxNode = SceneJS.createNode({
    type: "scale",
    cfg: {
      x: 100.0,
      y: 100.0,
      z: 100.0
    },
    nodes: [
      {
        type: "material",
        cfg: {
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
        },
        nodes: [
          {
            type: "texture",
            cfg: {
              layers: [
                {
                  uri: "textures/sky.png"
                }
              ]
            },
            nodes: [
              {
                type: "geometry",
                cfg: {
                  primitive: "triangles",
                  positions: [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1],
                  uv: [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
                  indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
                }
              }
            ]
          }
        ]
      }
    ]
  });
  sceneLookAtURI = "SceneLookAt";
  sceneLookAtConfig = {
    uri: sceneLookAtURI,
    eye: {
      x: 0.0,
      y: 10.0,
      z: 7.0
    },
    look: {
      x: 0.0,
      y: 0.0
    },
    up: {
      z: 1.0
    }
  };
  sceneLookAtNode = SceneJS.lookAt(sceneLookAtConfig, SceneJS.camera(cameraConfig, SceneJS.translate({
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
  }, platformsNode, SceneJS.stationary(skyboxNode))))));
  guiLightsConfig = {
    sources: [
      {
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
      }
    ]
  };
  guiLookAtConfig = {
    eye: {
      x: 0.0,
      y: 10.0,
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
  numberedDaisNode = function(index) {
    var node;
    node = towerNode(index, "selectTower" + index);
    node.addNode(SceneJS.instance({
      uri: towerURI[index]
    }));
    return SceneJS.translate({
      x: index * -1.5
    }, SceneJS.symbol({
      sid: "NumberedDais"
    }, BlenderExport.NumberedDais()), SceneJS.rotate(function(data) {
      return {
        angle: guiDiasRotPosition[index * 2],
        z: 1.0
      };
    }, SceneJS.rotate(function(data) {
      return {
        angle: guiDiasRotPosition[index * 2 + 1],
        x: 1.0
      };
    }, SceneJS.instance({
      uri: "NumberedDais"
    }), node)));
  };
  guiNode = SceneJS.translate({
    x: -8.0,
    y: -4.0
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
    specular: 0.0,
    shine: 0.0
  }, numberedDaisNode(0), numberedDaisNode(1)));
  gameScene = SceneJS.scene({
    canvasId: "gameCanvas",
    loggingElementId: "scenejsLog"
  }, SceneJS.symbol({
    sid: "ArcherTower"
  }, BlenderExport.ArcherTower()), SceneJS.symbol({
    sid: "CatapultTower"
  }, BlenderExport.CatapultTower()), SceneJS.renderer({
    clear: {
      depth: true,
      color: true,
      stencil: false
    },
    clearColor: {
      r: 0.7,
      g: 0.7,
      b: 0.7
    }
  }, SceneJS.lights(guiLightsConfig, SceneJS.lookAt(guiLookAtConfig, SceneJS.camera(cameraConfig, guiNode))), SceneJS.lights(sceneLightsConfig, sceneLookAtNode)));
  /*
  Initialization and rendering loop
  */
  yaw = 45;
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
  towers = new Array(sqrGridSize * levels);
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
    var cx, cy, cz, node, parentNode, t;
    for (cz = 0; (0 <= levels ? cz < levels : cz > levels); (0 <= levels ? cz += 1 : cz -= 1)) {
      for (cy = 0; (0 <= gridSize ? cy < gridSize : cy > gridSize); (0 <= gridSize ? cy += 1 : cy -= 1)) {
        for (cx = 0; (0 <= gridSize ? cx < gridSize : cx > gridSize); (0 <= gridSize ? cx += 1 : cx -= 1)) {
          t = towers[cz * sqrGridSize + cy * gridSize + cx];
          if (t !== 0) {
            if (t === 1) {
              node = SceneJS.instance({
                uri: towerURI[0]
              });
              parentNode = levelNodes[cz].archerTowers;
            } else if (t === 2) {
              node = SceneJS.instance({
                uri: towerURI[1]
              });
              parentNode = levelNodes[cz].catapultTowers;
            } else {
              alert("" + (cz * sqrGridSize + cy * gridSize + cx) + " : " + t);
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
  createTowers(towers);
  /*
  User input
  */
  intersectRayXYPlane = function(rayOrigin, rayDirection, planeZ) {
    var dist, zDist;
    if (rayDirection[2] === 0) {
      return null;
    } else {
      zDist = planeZ - rayOrigin[2];
      dist = zDist / rayDirection[2];
      return dist < 0 ? null : addVec3(rayOrigin, mulVec3Scalar(rayDirection, dist));
    }
  };
  lastX = 0;
  lastY = 0;
  dragging = false;
  keyDown = function(event) {
    var _b;
    if ((_b = String.fromCharCode(event.keyCode)) === "1") {
      return (currentTowerSelection = 0);
    } else if (_b === "2") {
      return (currentTowerSelection = 1);
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
    var canvasElement, intersection, lookAtEye, lookAtLook, lookAtUp, mouseX, mouseY, rayOrigin, screenX, screenY, xAxis, yAxis, zAxis;
    if (dragging) {
      yaw += (event.clientX - lastX) * 0.5;
      pitch += (event.clientY - lastY) * -0.5;
      lastX = event.clientX;
      return (lastY = event.clientY);
    } else {
      mouseX = event.clientX;
      mouseY = event.clientY;
      canvasElement = document.getElementById("gameCanvas");
      mouseX -= canvasElement.offsetLeft;
      mouseY -= canvasElement.offsetTop;
      lookAtEye = sceneLookAtNode.getEye();
      lookAtUp = sceneLookAtNode.getUp();
      lookAtLook = sceneLookAtNode.getLook();
      rayOrigin = [lookAtEye.x, lookAtEye.y, lookAtEye.z];
      yAxis = [lookAtUp.x, lookAtUp.y, lookAtUp.z];
      zAxis = [lookAtLook.x, lookAtLook.y, lookAtLook.z];
      zAxis = subVec3(zAxis, rayOrigin);
      zAxis = normalizeVec3(zAxis);
      xAxis = normalizeVec3(cross3Vec3(yAxis, zAxis));
      yAxis = cross3Vec3(zAxis, xAxis);
      screenX = mouseX / canvasSize[0];
      screenY = 1.0 - mouseY / canvasSize[1];
      rayOrigin = addVec3(rayOrigin, mulVec3Scalar(xAxis, lerp(screenX, cameraConfig.optics.left, cameraConfig.optics.right)));
      rayOrigin = addVec3(rayOrigin, mulVec3Scalar(yAxis, lerp(screenY, cameraConfig.optics.bottom, cameraConfig.optics.top)));
      intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[0]);
      if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformLengths[0] && Math.abs(intersection[1]) < platformLengths[0]) {
        towerPlacement.level = 0;
        towerPlacement.cell.x = Math.floor(intersection[0]);
        towerPlacement.cell.y = Math.floor(intersection[1]);
      } else {
        intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[1]);
        if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformLengths[1] && Math.abs(intersection[1]) < platformLengths[1]) {
          towerPlacement.level = 1;
          towerPlacement.cell.x = Math.floor(intersection[0]);
          towerPlacement.cell.y = Math.floor(intersection[1]);
        } else {
          intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[2]);
          if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformLengths[2] && Math.abs(intersection[1]) < platformLengths[2]) {
            towerPlacement.level = 2;
            towerPlacement.cell.x = Math.floor(intersection[0]);
            towerPlacement.cell.y = Math.floor(intersection[1]);
          } else {
            towerPlacement.level = -1;
            towerPlacement.cell.x = -1;
            towerPlacement.cell.y = -1;
          }
        }
      }
      return towerPlacement.level !== -1 && currentTowerSelection !== -1 ? SceneJS.fireEvent("configure", "placementTower", {
        cfg: {
          x: intersection[0],
          y: intersection[1],
          z: platformHeights[towerPlacement.level],
          "#placementTowerModel": {
            selection: []
          }
        }
      }) : SceneJS.fireEvent("configure", "placementTowerModel", {
        cfg: {
          selection: [currentTowerSelection]
        }
      });
    }
  };
  canvas.addEventListener('mousedown', mouseDown, true);
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mouseup', mouseUp, true);
  document.onkeydown = keyDown;
  window.render = function() {
    for (c = 0; (0 <= numTowerTypes ? c < numTowerTypes : c > numTowerTypes); (0 <= numTowerTypes ? c += 1 : c -= 1)) {
      guiDiasRotVelocity[c] += (Math.random() - 0.5) * 0.1;
      if (guiDiasRotPosition[c] > 0) {
        guiDiasRotVelocity[c] -= 0.001;
      }
      if (guiDiasRotPosition[c] < 0) {
        guiDiasRotVelocity[c] += 0.001;
      }
      guiDiasRotVelocity[c] = clamp(guiDiasRotVelocity[c], -0.1, 0.1);
      guiDiasRotPosition[c] += guiDiasRotVelocity[c];
      guiDiasRotPosition[c] = clamp(guiDiasRotPosition[c], -30.0, 30.0);
    }
    return gameScene.setData({
      yaw: yaw,
      pitch: pitch
    }).render();
  };
  interval = window.setInterval("window.render()", 10);
})();

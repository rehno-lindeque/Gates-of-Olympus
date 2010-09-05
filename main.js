(function() {
  var calcTowerPlacement, canvas, currentTowerSelection, intersectRayXYPlane, interval, keyDown, mouseDown, mouseDragging, mouseLastX, mouseLastY, mouseMove, mouseUp, updateTowerPlacement;
  /*
  Gates of Olympus (A multi-layer Tower Defense game...)
  Copyright 2010, Rehno Lindeque.

  * Please visit http://gatesofolympus.com/.
  * This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
  */
  /*
  Initialization and rendering loop
  */
  gameScene.render();
  canvas = document.getElementById(gameScene.getCanvasId());
  /*
  Game logic
  */
  currentTowerSelection = -1;
  level.towers[0] = 0;
  level.towers[1] = 0;
  level.towers[2] = 0;
  level.towers[3] = 1;
  level.towers[4] = 1;
  level.towers[5] = 1;
  level.towers[6] = 0;
  level.towers[7] = 1;
  level.towers[8] = 0;
  level.towers[9] = 0;
  level.towers[10] = 0;
  level.towers[11] = 0;
  level.towers[sqrGridSize + 0] = 0;
  level.towers[sqrGridSize + 1] = 1;
  level.towers[sqrGridSize + 2] = 0;
  level.towers[sqrGridSize + 3] = 0;
  level.towers[sqrGridSize + 4] = 0;
  level.towers[sqrGridSize + 5] = 1;
  level.towers[sqrGridSize + 6] = 0;
  level.towers[sqrGridSize + 7] = 1;
  level.towers[sqrGridSize + 8] = 0;
  level.towers[sqrGridSize + 9] = 0;
  level.towers[sqrGridSize + 10] = 0;
  level.towers[sqrGridSize + 11] = 0;
  level.towers[290] = 0;
  level.towers[291] = 0;
  level.towers[292] = 1;
  level.towers[293] = 0;
  level.towers[294] = 0;
  level.towers[295] = 0;
  level.towers[296] = 0;
  level.towers[297] = 1;
  level.towers[298] = 1;
  level.towers[299] = 0;
  level.createTowers(level.towers);
  level.creatures.addCreature(Scorpion);
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
  mouseLastX = 0;
  mouseLastY = 0;
  mouseDragging = false;
  calcTowerPlacement = function(level, intersection) {
    return {
      x: Math.floor(intersection[0] / (cellScale * platformScales[level]) + gridHalfSize),
      y: Math.floor(intersection[1] / (cellScale * platformScales[level]) + gridHalfSize)
    };
  };
  updateTowerPlacement = function() {
    var canvasElement, intersection, lookAtEye, lookAtLook, lookAtUp, mouseX, mouseY, rayOrigin, screenX, screenY, xAxis, yAxis, zAxis;
    mouseX = mouseLastX;
    mouseY = mouseLastY;
    canvasElement = document.getElementById("gameCanvas");
    mouseX -= canvasElement.offsetLeft;
    mouseY -= canvasElement.offsetTop;
    lookAtEye = sceneLookAt.node.getEye();
    lookAtUp = sceneLookAt.node.getUp();
    lookAtLook = sceneLookAt.node.getLook();
    rayOrigin = [lookAtEye.x, lookAtEye.y, lookAtEye.z];
    yAxis = [lookAtUp.x, lookAtUp.y, lookAtUp.z];
    zAxis = [lookAtLook.x, lookAtLook.y, lookAtLook.z];
    zAxis = subVec3(zAxis, rayOrigin);
    zAxis = normalizeVec3(zAxis);
    xAxis = normalizeVec3(cross3Vec3(zAxis, yAxis));
    yAxis = cross3Vec3(xAxis, zAxis);
    screenX = mouseX / canvasSize[0];
    screenY = 1.0 - mouseY / canvasSize[1];
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(xAxis, lerp(screenX, sceneCamera.config.optics.left, sceneCamera.config.optics.right)));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(yAxis, lerp(screenY, sceneCamera.config.optics.bottom, sceneCamera.config.optics.top)));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(xAxis, gameSceneOffset[0]));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(yAxis, gameSceneOffset[1]));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(zAxis, gameSceneOffset[2]));
    intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[0]);
    if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformLengths[0] && Math.abs(intersection[1]) < platformLengths[0]) {
      towerPlacement.level = 0;
      towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection);
    } else {
      intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[1]);
      if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformLengths[1] && Math.abs(intersection[1]) < platformLengths[1]) {
        towerPlacement.level = 1;
        towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection);
      } else {
        intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[2]);
        if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformLengths[2] && Math.abs(intersection[1]) < platformLengths[2]) {
          towerPlacement.level = 2;
          towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection);
        } else {
          towerPlacement.level = -1;
          towerPlacement.cell.x = -1;
          towerPlacement.cell.y = -1;
        }
      }
    }
    if (towerPlacement.level !== -1 && currentTowerSelection !== -1) {
      SceneJS.fireEvent("configure", "placementTower", {
        cfg: {
          x: intersection[0],
          y: intersection[1],
          z: platformHeights[towerPlacement.level],
          "#placementTowerModel": {
            selection: [currentTowerSelection]
          }
        }
      });
    } else {
      SceneJS.fireEvent("configure", "placementTower", {
        cfg: {
          "#placementTowerModel": {
            selection: []
          }
        }
      });
    }
    return null;
  };
  keyDown = function(event) {
    var _a;
    if ((_a = event.keyCode) === key1) {
      currentTowerSelection = 0;
    } else if (_a === key2) {
      currentTowerSelection = 1;
    } else if (_a === keyESC) {
      currentTowerSelection = -1;
    }
    return updateTowerPlacement();
  };
  mouseDown = function(event) {
    mouseLastX = event.clientX;
    mouseLastY = event.clientY;
    return (mouseDragging = true);
  };
  mouseUp = function() {
    if (towerPlacement.level !== -1 && currentTowerSelection !== -1) {
      level.addTower(towerPlacement, currentTowerSelection);
    }
    return (mouseDragging = false);
  };
  mouseMove = function(event) {
    if (mouseDragging) {
      sceneLookAt.angle += (event.clientX - mouseLastX) * mouseSpeed;
      sceneLookAt.update();
    }
    mouseLastX = event.clientX;
    mouseLastY = event.clientY;
    return !mouseDragging ? updateTowerPlacement() : null;
  };
  canvas.addEventListener('mousedown', mouseDown, true);
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mouseup', mouseUp, true);
  document.onkeydown = keyDown;
  window.render = function() {
    var c;
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
    return gameScene.render();
  };
  interval = window.setInterval("window.render()", 10);
})();

(function() {
  var _a, c, canvas, createTowers, currentTowerSelection, intersectRayXYPlane, interval, keyDown, mouseDown, mouseDragging, mouseLastX, mouseLastY, mouseMove, mouseUp, pitch, towers, updateTowerPlacement, yaw;
  /*
  Gates of Olympus (A multi-layer Tower Defense game...)
  Copyright 2010, Rehno Lindeque.

  * Please visit http://gatesofolympus.com/.
  * This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
  */
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
              parentNode = level.levelNodes[cz].archerTowers;
            } else if (t === 2) {
              node = SceneJS.instance({
                uri: towerURI[1]
              });
              parentNode = level.levelNodes[cz].catapultTowers;
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
  mouseLastX = 0;
  mouseLastY = 0;
  mouseDragging = false;
  updateTowerPlacement = function() {
    var canvasElement, intersection, lookAtEye, lookAtLook, lookAtUp, mouseX, mouseY, rayOrigin, screenX, screenY, xAxis, yAxis, zAxis;
    mouseX = mouseLastX;
    mouseY = mouseLastY;
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
    var _b;
    if ((_b = String.fromCharCode(event.keyCode)) === "1") {
      currentTowerSelection = 0;
    } else if (_b === "2") {
      currentTowerSelection = 1;
    } else {
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
    return (mouseDragging = false);
  };
  mouseMove = function(event) {
    if (mouseDragging) {
      yaw += (event.clientX - mouseLastX) * 0.5;
      pitch += (event.clientY - mouseLastY) * -0.5;
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

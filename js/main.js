(function() {
  var calcTowerPlacement, canvas, customGL, intersectRayXYPlane, interval, keyDown, mouseDown, mouseDragging, mouseLastX, mouseLastY, mouseMove, mouseUp, updateTowerPlacement;
  /*
  Gates of Olympus (A multi-layer Tower Defense game...)
  Copyright 2010, Rehno Lindeque.

  * Please visit http://gatesofolympus.com/.
  * This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
  */
  /*
  Initialization and rendering loop
  */
  canvas = document.getElementById(sceneNode.canvasId);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameScene.render();
  gui.initialize();
  /*
  Sound
  */
  /*
  marchSound = document.getElementById('march')
  marchSoundListener = () ->
  	this.pause()
  	this.currentTime = 0
  	this.play()

  marchSound.addEventListener('ended', marchSoundListener, false)
  */
  customGL = canvas.getContext("experimental-webgl", {
    antialias: false
  });
  /*
  Development
  */
  SceneJS.setDebugConfigs({
    webgl: {
      logTrace: true
    }
  });
  /*
  Game logic
  */
  level.creatures.addCreature(Fish);
  floodInit();
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
    var canvasElement, intersection, lookAtEye, lookAtLook, lookAtUp, mouseX, mouseY, rayDirection, rayOrigin, sceneLookAt, screenX, screenY, xAxis, yAxis, zAxis;
    mouseX = mouseLastX;
    mouseY = mouseLastY;
    canvasElement = document.getElementById("gameCanvas");
    mouseX -= canvasElement.offsetLeft;
    mouseY -= canvasElement.offsetTop;
    sceneLookAt = levelLookAt.withSceneLookAt();
    lookAtEye = sceneLookAt.get("eye");
    lookAtUp = sceneLookAt.get("up");
    lookAtLook = sceneLookAt.get("look");
    rayOrigin = [lookAtEye.x, lookAtEye.y, lookAtEye.z];
    yAxis = [lookAtUp.x, lookAtUp.y, lookAtUp.z];
    zAxis = [lookAtLook.x, lookAtLook.y, lookAtLook.z];
    zAxis = subVec3(zAxis, rayOrigin);
    zAxis = normalizeVec3(zAxis);
    xAxis = normalizeVec3(cross3Vec3(zAxis, yAxis));
    yAxis = cross3Vec3(xAxis, zAxis);
    screenX = mouseX / canvasSize[0];
    screenY = 1.0 - mouseY / canvasSize[1];
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(xAxis, lerp(screenX, levelCamera.optics.left, levelCamera.optics.right)));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(yAxis, lerp(screenY, levelCamera.optics.bottom, levelCamera.optics.top)));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(xAxis, gameSceneOffset[0]));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(yAxis, gameSceneOffset[1]));
    rayOrigin = addVec3(rayOrigin, mulVec3Scalar(zAxis, gameSceneOffset[2]));
    rayDirection = zAxis;
    intersection = intersectRayXYPlane(rayOrigin, rayDirection, platformScaleHeights[0]);
    if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformScaleLengths[0] && Math.abs(intersection[1]) < platformScaleLengths[0]) {
      towerPlacement.level = 0;
      towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection);
    } else {
      intersection = intersectRayXYPlane(rayOrigin, rayDirection, platformScaleHeights[1]);
      if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformScaleLengths[1] && Math.abs(intersection[1]) < platformScaleLengths[1]) {
        towerPlacement.level = 1;
        towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection);
      } else {
        intersection = intersectRayXYPlane(rayOrigin, rayDirection, platformScaleHeights[2]);
        if ((typeof intersection !== "undefined" && intersection !== null) && Math.abs(intersection[0]) < platformScaleLengths[2] && Math.abs(intersection[1]) < platformScaleLengths[2]) {
          towerPlacement.level = 2;
          towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection);
        } else {
          towerPlacement.level = -1;
          towerPlacement.cell.x = -1;
          towerPlacement.cell.y = -1;
        }
      }
    }
    if (towerPlacement.level !== -1 && gui.selectedDais !== -1) {
      SceneJS.withNode("placementTower").set({
        x: (towerPlacement.cell.x - gridSize * 0.5 + 0.5) * cellScale,
        y: (towerPlacement.cell.y - gridSize * 0.5 + 0.5) * cellScale,
        z: platformHeights[towerPlacement.level]
      }).node("placementTowerModel").set("selection", [gui.selectedDais]);
    } else {
      SceneJS.withNode("placementTower").node("placementTowerModel").set("selection", []);
    }
    return null;
  };
  keyDown = function(event) {
    var _a;
    if ((_a = event.keyCode) === key1) {
      gui.selectDais(0);
    } else if (_a === key2) {
      gui.selectDais(1);
    } else if (_a === key3) {
      gui.selectDais(2);
    } else if (_a === keyESC) {
      gui.deselectDais();
    }
    return updateTowerPlacement();
  };
  mouseDown = function(event) {
    mouseLastX = event.clientX;
    mouseLastY = event.clientY;
    return (mouseDragging = true);
  };
  mouseUp = function() {
    if (towerPlacement.level !== -1 && gui.selectedDais !== -1) {
      level.addTower(towerPlacement, gui.selectedDais);
      dirtyLevel[towerPlacement.level] = true;
    }
    mouseDragging = false;
    return SceneJS.withNode("gameScene").pick(mouseLastX, mouseLastY);
  };
  mouseMove = function(event) {
    if (mouseDragging) {
      levelLookAt.angle += (event.clientX - mouseLastX) * mouseSpeed;
      levelLookAt.update();
    }
    mouseLastX = event.clientX;
    mouseLastY = event.clientY;
    return !mouseDragging ? updateTowerPlacement() : null;
  };
  canvas.addEventListener('mousedown', mouseDown, true);
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mouseup', mouseUp, true);
  document.onkeydown = keyDown;
  window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasSize[0] = window.innerWidth;
    canvasSize[1] = window.innerHeight;
    backgroundCamera.reconfigure(canvasSize);
    levelCamera.reconfigure(canvasSize);
    return guiCamera.reconfigure();
  };
  window.render = function() {
    var _a, _b, c, eye, lightAmount, look, optics, projection, up, view;
    _a = (2 * numTowerTypes - 1);
    for (c = 0; (0 <= _a ? c <= _a : c >= _a); (0 <= _a ? c += 1 : c -= 1)) {
      guiDaisRotVelocity[c] += (Math.random() - 0.5) * 0.005;
      if (guiDaisRotPosition[c] > 0) {
        guiDaisRotVelocity[c] -= 0.0003;
      }
      if (guiDaisRotPosition[c] < 0) {
        guiDaisRotVelocity[c] += 0.0003;
      }
      guiDaisRotVelocity[c] = clamp(guiDaisRotVelocity[c], -0.5, 0.5);
      guiDaisRotPosition[c] += guiDaisRotVelocity[c];
      guiDaisRotPosition[c] = clamp(guiDaisRotPosition[c], -30.0, 30.0);
    }
    gui.update();
    updateAI();
    level.update();
    lightAmount = clamp(sun.position[2] + 0.5, 0.2, 1.2);
    levelCamera.updateLight([lightAmount, lightAmount, lightAmount], negateVector3(sun.position));
    timeline.update(1);
    gameScene.render();
    eye = levelLookAt.backgroundLookAtNode.eye;
    look = levelLookAt.backgroundLookAtNode.look;
    up = levelLookAt.backgroundLookAtNode.up;
    view = lookAtMat4c(eye.x, eye.y, 0.0, look.x, look.y, 1.0, up.x, up.y, up.z);
    optics = backgroundCamera.optics;
    projection = perspectiveMatrix4(optics.fovy * Math.PI / 180.0, optics.aspect, optics.near, optics.far);
    atmosphere.render(customGL, mat4To3(view), inverseMat4(projection), optics.near, sun.position);
    moon.render(customGL, view, projection, timeline.time);
    sun.render(customGL, view, projection, timeline.time);
    _b = [];
    for (c = 0; (0 <= numTowerTypes - 1 ? c <= numTowerTypes - 1 : c >= numTowerTypes - 1); (0 <= numTowerTypes - 1 ? c += 1 : c -= 1)) {
      _b.push(gui.daises[c].daisClouds.render(customGL, timeline.time));
    }
    return _b;
  };
  interval = window.setInterval("window.render()", 10);
})();

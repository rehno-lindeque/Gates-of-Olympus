(function(){
  var BillboardPlane, canvas, dragging, gameScene, lastX, lastY, mouseDown, mouseMove, mouseUp, pitch, yaw;
  /*
  Olympus Tower defence
  Copyright (C) 2010, Rehno Lindeque.
  */
  BillboardPlane = function() {
    SceneJS.Geometry.apply(this, arguments);
    this._nodeType = "BillboardPlane";
    return this._fixedParams ? this._init(this._getParams()) : null;
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
  }, SceneJS.stationary({}, SceneJS.renderer({
    enableTexture2D: true
  }, SceneJS.scale({
    x: 100.0,
    y: 100.0,
    z: 100.0
  }, SceneJS.objects.cube))), SceneJS.camera({
    optics: {
      type: "ortho",
      left: -1.0,
      right: 1.0,
      bottom: -1.0,
      top: 1.0,
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
  }, SceneJS.material({
    baseColor: {
      r: 0.3,
      g: 0.3,
      b: 0.9
    },
    specularColor: {
      r: 0.9,
      g: 0.9,
      b: 0.9
    },
    specular: 0.9,
    shine: 6.0
  }, SceneJS.scale({
    x: 0.4,
    y: 0.4,
    z: 0.4
  }, SceneJS.geometry({
    type: "plane0",
    primitive: "triangles",
    positions: [-1, 1, 2.5, 1, 1, 2.5, 1, -1, 2.5, -1, -1, 2.5],
    indices: [0, 1, 2, 0, 2, 3]
  }), SceneJS.geometry({
    type: "plane1",
    primitive: "triangles",
    positions: [-1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0],
    indices: [0, 1, 2, 0, 2, 3]
  }), SceneJS.geometry({
    type: "plane2",
    primitive: "triangles",
    positions: [-1, 1, -2.5, 1, 1, -2.5, 1, -1, -2.5, -1, -1, -2.5],
    indices: [0, 1, 2, 0, 2, 3]
  }), BlenderExport.ArcherTower(), SceneJS.symbol({
    sid: "archerTower"
  }, SceneJS.objects.cube(), SceneJS.instance({
    uri: "archerTower"
  }))))))))));
  /*
  Initialization and rendering loop
  */
  yaw = 0;
  pitch = 0;
  lastX = 0;
  lastY = 0;
  dragging = false;
  gameScene.setData({
    yaw: yaw,
    pitch: pitch
  }).render();
  canvas = document.getElementById(gameScene.getCanvasId());
  mouseDown = function(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
    return dragging;
  };
  mouseUp = function() {
    dragging = false;
    return dragging;
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
      lastY = event.clientY;
      return lastY;
    }
  };
  canvas.addEventListener('mousedown', mouseDown, true);
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mouseup', mouseUp, true);
})();

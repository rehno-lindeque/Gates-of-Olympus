(function(){
  var BillboardPlane, archerTower, c, canvas, createTowers, dragging, gameScene, lastX, lastY, mouseDown, mouseMove, mouseUp, pitch, towers, towersNode, yaw;
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
  towersNode = SceneJS.node({
    sid: "towers"
  });
  archerTower = new SceneJS.Material({
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
  }, BlenderExport.ArcherTower());
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
  }, SceneJS.scale({
    x: 0.4,
    y: 0.4,
    z: 0.4
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
  }, SceneJS.geometry({
    type: "plane0",
    primitive: "triangles",
    positions: [-15, 15, 15, 15, 15, 15, 15, -15, 15, -15, -15, 15],
    indices: [0, 1, 2, 0, 2, 3]
  }), SceneJS.geometry({
    type: "plane1",
    primitive: "triangles",
    positions: [-15, 15, 0, 15, 15, 0, 15, -15, 0, -15, -15, 0],
    indices: [0, 1, 2, 0, 2, 3]
  }), SceneJS.geometry({
    type: "plane2",
    primitive: "triangles",
    positions: [-15, 15, -15, 15, 15, -15, 15, -15, -15, -15, -15, -15],
    indices: [0, 1, 2, 0, 2, 3]
  })), SceneJS.symbol({
    sid: "ArcherTower"
  }, SceneJS.material({
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
  }, BlenderExport.ArcherTower())), towersNode)))))));
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
  /*
  Game logic
  */
  towers = new Array(300);
  for (c = 0; c < 300; c += 1) {
    towers[c] = 0;
  }
  towers[0] = 1;
  towers[1] = 1;
  towers[2] = 1;
  towers[3] = 1;
  towers[4] = 1;
  towers[5] = 1;
  towers[6] = 1;
  towers[7] = 1;
  towers[8] = 1;
  towers[9] = 1;
  towers[190] = 1;
  towers[191] = 1;
  towers[192] = 1;
  towers[193] = 1;
  towers[194] = 1;
  towers[195] = 1;
  towers[196] = 1;
  towers[197] = 1;
  towers[198] = 1;
  towers[199] = 1;
  towers[290] = 1;
  towers[291] = 1;
  towers[292] = 1;
  towers[293] = 1;
  towers[294] = 1;
  towers[295] = 1;
  towers[296] = 1;
  towers[297] = 1;
  towers[298] = 1;
  towers[299] = 1;
  createTowers = function(towers) {
    var ix, iy, iz, t, towerNode;
    for (iz = 0; iz < 3; iz += 1) {
      for (iy = 0; iy < 10; iy += 1) {
        for (ix = 0; ix < 10; ix += 1) {
          t = towers[iz * 100 + iy * 10 + ix];
          if (t !== 0) {
            if (t === 1) {
              towerNode = new SceneJS.Instance({
                uri: "../ArcherTower"
              });
            } else {
              alert("" + (iz * 100 + iy * 10 + ix) + " : " + t);
            }
            towersNode.addNode(new SceneJS.Translate({
              x: 3.0 * (ix - 5),
              y: 3.0 * (iy - 5),
              z: 15.0 * (1 - iz)
            }, towerNode));
          }
        }
      }
    }
    return null;
  };
  createTowers(towers);
})();

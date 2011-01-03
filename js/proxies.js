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
          r: 0.0,
          g: 0.0,
          b: 0.0
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
towerNode = function(index, id, instances) {
  return {
    type: "material",
    baseColor: {
      r: 0.0,
      g: 0.0,
      b: 0.0
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
        id: id,
        layers: [
          {
            uri: towerTextureURI[index]
          }
        ],
        nodes: instances
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
          towerNode(0, "placementTower" + 0, [
            {
              type: "instance",
              target: towerIds[0]
            }
          ]), towerNode(1, "placementTower" + 1, [
            {
              type: "instance",
              target: towerIds[1]
            }
          ]), towerNode(2, "placementTower" + 2, [
            {
              type: "instance",
              target: towerIds[2]
            }
          ])
        ]
      }
    ]
  };
};
/*
A proxy for the whole level with platforms and creatures etc.
*/
Level = function() {
  this.towers = new Towers();
  this.creatures = new Creatures();
  this.towerNodes = [
    {
      archerTowers: towerNode(0, "archerTowers0", []),
      catapultTowers: towerNode(1, "catapultTowers0", []),
      ballistaTowers: towerNode(2, "ballistaTowers0", [])
    }, {
      archerTowers: towerNode(0, "archerTowers1", []),
      catapultTowers: towerNode(1, "catapultTowers1", []),
      ballistaTowers: towerNode(2, "ballistaTowers1", [])
    }, {
      archerTowers: towerNode(0, "archerTowers2", []),
      catapultTowers: towerNode(1, "catapultTowers2", []),
      ballistaTowers: towerNode(2, "ballistaTowers2", [])
    }
  ];
  this.node = this.createNode();
  return this;
};
Level.prototype.getTowerRoot = function(level, towerType) {
  if (towerType === 0) {
    return this.towerNodes[level].archerTowers;
  } else if (towerType === 1) {
    return this.towerNodes[level].catapultTowers;
  } else if (towerType === 2) {
    return this.towerNodes[level].ballistaTowers;
  } else {
    return null;
  }
};
Level.prototype.addTower = function(towerPlacement, towerType) {
  var cx, cy, cz, index, node, parentNode;
  index = towerPlacement.level * sqrGridSize + towerPlacement.cell.y * gridSize + towerPlacement.cell.x;
  if (this.towers.towers[index] === -1) {
    this.towers.towers[index] = towerType;
    parentNode = this.getTowerRoot(towerPlacement.level, towerType);
    node = {
      type: "instance",
      target: towerIds[towerType]
    };
    cx = towerPlacement.cell.x;
    cy = towerPlacement.cell.y;
    cz = towerPlacement.level;
    SceneJS.withNode(parentNode.nodes[0].id).add("nodes", [
      {
        type: "translate",
        x: cellScale * (cx - gridSize / 2) + cellScale * 0.5,
        y: cellScale * (cy - gridSize / 2) + cellScale * 0.5,
        nodes: [node]
      }
    ]);
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
    nodes: this.platformGeometry("level" + k).concat([this.towerNodes[k].archerTowers, this.towerNodes[k].catapultTowers, this.towerNodes[k].ballistaTowers])
  };
};
Level.prototype.platformGeometry = function(platformId) {
  var cx, cy, gridIndex, i, n, p, s;
  s = gridSize * cellScale;
  n = gridSize;
  p = new Array((n + 1) * (n + 1) * 3);
  i = new Array(n * n * 3);
  for (cy = 0; (0 <= n ? cy <= n : cy >= n); (0 <= n ? cy += 1 : cy -= 1)) {
    for (cx = 0; (0 <= n ? cx <= n : cx >= n); (0 <= n ? cx += 1 : cx -= 1)) {
      p[((cy * (n + 1) + cx) * 3 + 0)] = s * (cx) / n - s * 0.5;
      p[((cy * (n + 1) + cx) * 3 + 1)] = s * (cy) / n - s * 0.5;
      p[((cy * (n + 1) + cx) * 3 + 2)] = 0.0;
    }
  }
  for (cy = 0; (0 <= n - 1 ? cy <= n - 1 : cy >= n - 1); (0 <= n - 1 ? cy += 1 : cy -= 1)) {
    for (cx = cy % 2; (cy % 2 <= n - 1 ? cx <= n - 1 : cx >= n - 1); (cy % 2 <= n - 1 ? cx += 1 : cx -= 1)) {
      gridIndex = (cy * n + cx) * 6;
      i.splice.apply(i, [gridIndex + 0, gridIndex + 5 - gridIndex + 0 + 1].concat([(cy) * (n + 1) + (cx + 0), (cy) * (n + 1) + (cx + 1), (cy + 1) * (n + 1) + (cx + 0), (cy + 1) * (n + 1) + (cx + 0), (cy) * (n + 1) + (cx + 1), (cy + 1) * (n + 1) + (cx + 1)]));
      cx += 1;
    }
  }
  return [
    {
      type: "geometry",
      resource: platformId,
      id: platformId,
      primitive: "triangles",
      positions: p,
      indices: i
    }
  ];
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
        id: "sunLight",
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
      }, {
        type: "light",
        id: "moonLight",
        mode: "dir",
        color: {
          r: 0.5,
          g: 0.5,
          b: 0.5
        },
        diffuse: true,
        specular: false,
        dir: {
          x: -1.0,
          y: -1.0,
          z: -1.0
        }
      }, {
        type: "matrix",
        elements: [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, platformScaleFactor, 0.0, 0.0, 0.0, 1.0],
        nodes: [levelNode]
      }
    ]
  };
  return this;
};
LevelCamera.prototype.withNode = function() {
  return SceneJS.withNode("sceneCamera");
};
LevelCamera.prototype.reconfigure = function(canvasSize) {
  this.optics.left = -12.5 * (canvasSize[0] / canvasSize[1]);
  this.optics.right = 12.5 * (canvasSize[0] / canvasSize[1]);
  return this.withNode().set("optics", this.optics);
};var LevelLookAt;
/*
The look-at proxy for the main game scene
*/
LevelLookAt = function(cameraNode, backgroundCameraNode) {
  this.angle = Math.PI * 0.25;
  this.radius = 10.0;
  this.lookAtNode = {
    type: "lookAt",
    id: "SceneLookAt",
    eye: {
      x: (Math.sin(this.angle)) * this.radius,
      y: (Math.cos(this.angle)) * -this.radius,
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
      x: (Math.sin(this.angle)) * this.radius,
      y: (Math.cos(this.angle)) * -this.radius,
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
    nodes: [
      {
        type: "translate",
        x: gameSceneOffset[0],
        y: gameSceneOffset[1],
        z: gameSceneOffset[2],
        nodes: [this.lookAtNode]
      }
    ]
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
  this.lookAtNode.eye = {
    x: (Math.sin(this.angle)) * this.radius,
    y: (Math.cos(this.angle)) * -this.radius,
    z: 7.0
  };
  this.backgroundLookAtNode.eye = this.lookAtNode.eye;
  this.withSceneLookAt().set("eye", this.lookAtNode.eye);
  return this.withBackgroundLookAt().set("eye", this.lookAtNode.eye);
};var GUIDais, guiDaisNode;
/*
A proxy for dais tower selection gui element
*/
guiDaisNode = function(id, index) {
  return {
    type: "translate",
    id: id,
    x: index * 1.5,
    nodes: [
      {
        type: "translate",
        y: 2.5,
        nodes: [
          {
            type: "rotate",
            sid: "rotZ",
            angle: guiDaisRotPosition[index * 2],
            z: 1.0,
            nodes: [
              {
                type: "rotate",
                sid: "rotX",
                angle: guiDaisRotPosition[index * 2],
                x: 1.0,
                nodes: [
                  {
                    type: "texture",
                    layers: [
                      {
                        uri: "textures/dais1normals.png",
                        applyTo: "normals"
                      }, {
                        uri: "textures/dais.jpg",
                        applyTo: "baseColor"
                      }
                    ],
                    nodes: [
                      {
                        type: "instance",
                        target: "NumberedDais"
                      }
                    ]
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
      }
    ]
  };
};
GUIDais = function(index) {
  this.index = index;
  this.id = "dais" + index;
  this.daisClouds = new DaisClouds(index);
  this.node = graft(guiDaisNode(this.id, index), [this.daisClouds.node]);
  return this;
};
GUIDais.prototype.update = function() {
  return SceneJS.withNode(this.id).node(0).node(0).set({
    angle: guiDaisRotPosition[this.index * 2],
    z: 1.0
  }).node(0).set({
    angle: guiDaisRotPosition[this.index * 2 + 1],
    x: 1.0
  });
};var GUI;
/*
Top level GUI container
*/
GUI = function() {
  this.daises = new Array(3);
  this.daises[0] = new GUIDais(0);
  this.daises[1] = new GUIDais(1);
  this.daises[2] = new GUIDais(2);
  this.daisGeometry = SceneJS.createNode(BlenderExport.NumberedDais);
  this.selectedDais = -1;
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
        type: "scale",
        x: 1.4,
        y: 1.4,
        z: 1.4,
        nodes: [
          {
            type: "material",
            baseColor: {
              r: 0.0,
              g: 0.0,
              b: 0.0
            },
            specularColor: {
              r: 1.0,
              g: 1.0,
              b: 1.0
            },
            specular: 0.0,
            shine: 0.0,
            nodes: [this.daises[0].node, this.daises[1].node, this.daises[2].node]
          }
        ]
      }
    ]
  };
  return this;
};
GUI.prototype.initialize = function() {
  var _a, _b, c;
  _a = [];
  for (_b = 0; (0 <= numTowerTypes - 1 ? _b <= numTowerTypes - 1 : _b >= numTowerTypes - 1); (0 <= numTowerTypes - 1 ? _b += 1 : _b -= 1)) {
    (function() {
      var c = _b;
      return _a.push(SceneJS.withNode(this.daises[c].id).bind("picked", function(event) {
        return gui.selectDais(c);
      }));
    }).call(this);
  }
  return _a;
};
GUI.prototype.update = function() {
  var _a, c;
  _a = [];
  for (c = 0; (0 <= numTowerTypes - 1 ? c <= numTowerTypes - 1 : c >= numTowerTypes - 1); (0 <= numTowerTypes - 1 ? c += 1 : c -= 1)) {
    _a.push(this.daises[c].update());
  }
  return _a;
};
GUI.prototype.selectDais = function(daisNumber) {
  if (this.selectedDais >= 0) {
    $("#daisStats #daisStats" + this.selectedDais).removeClass("enabled");
    $("#daisStats #daisStats" + this.selectedDais).addClass("disabled");
  }
  this.selectedDais = daisNumber;
  $("#daisStats #daisStats" + daisNumber).removeClass("disabled");
  return $("#daisStats #daisStats" + daisNumber).addClass("enabled");
};
GUI.prototype.deselectDais = function() {
  if (this.selectedDais >= 0) {
    $("#daisStats #daisStats" + this.selectedDais).removeClass("enabled");
    $("#daisStats #daisStats" + this.selectedDais).addClass("disabled");
  }
  return (this.selectedDais = -1);
};var GUICamera;
GUICamera = function(gui, referenceCamera) {
  this.referenceCamera = referenceCamera;
  this.node = {
    type: "camera",
    id: "guiCamera",
    optics: levelCamera.optics,
    nodes: [gui.node]
  };
  return this;
};
GUICamera.prototype.withNode = function() {
  return SceneJS.withNode("guiCamera");
};
GUICamera.prototype.reconfigure = function() {
  return this.withNode().set("optics", this.referenceCamera.optics);
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
    optics: this.optics
  };
  return this;
};
BackgroundCamera.prototype.withNode = function() {
  return SceneJS.withNode("backgroundCamera");
};
BackgroundCamera.prototype.reconfigure = function(canvasSize) {
  this.optics.aspect = canvasSize[0] / canvasSize[1];
  return this.withNode().set("optics", this.optics);
};var Moon, MoonModule;
/*
A proxy for the moon
*/
/*
Moon Module
*/
MoonModule = {
  vertexBuffer: null,
  textureCoordBuffer: null,
  shaderProgram: null,
  texture: null,
  createResources: function(gl) {
    var fragmentShader, tex, textureCoords, vertexShader, vertices;
    tex = (this.texture = gl.createTexture());
    tex.image = new Image();
    tex.image.src = "textures/moon.png";
    tex.image.onload = function() {
      return configureTexture(gl, tex);
    };
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    textureCoords = [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "moon-vs");
    fragmentShader = compileShader(gl, "moon-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    this.shaderProgram.textureCoord = gl.getAttribLocation(this.shaderProgram, "textureCoord");
    gl.enableVertexAttribArray(this.shaderProgram.textureCoord);
    this.shaderProgram.pos = gl.getUniformLocation(this.shaderProgram, "pos");
    this.shaderProgram.view = gl.getUniformLocation(this.shaderProgram, "view");
    this.shaderProgram.projection = gl.getUniformLocation(this.shaderProgram, "projection");
    this.shaderProgram.exposure = gl.getUniformLocation(this.shaderProgram, "exposure");
    this.shaderProgram.colorSampler = gl.getUniformLocation(this.shaderProgram, "colorSampler");
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
      if (this.textureCoordBuffer) {
        this.textureCoordBuffer.destroy();
      }
      if (this.texture) {
        this.texture.destroy();
      }
    }
    return null;
  },
  render: function(gl, view, projection, pos) {
    var k, saveState, shaderProgram;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    shaderProgram = this.shaderProgram;
    gl.useProgram(shaderProgram);
    for (k = 2; k <= 7; k++) {
      gl.disableVertexAttribArray(k);
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.colorSampler, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.enableVertexAttribArray(shaderProgram.textureCoord);
    gl.vertexAttribPointer(shaderProgram.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(shaderProgram.pos, pos[0], pos[1], pos[2]);
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view));
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection));
    gl.uniform1f(shaderProgram.exposure, 0.4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return MoonModule.destroyResources();
});
/*
Moon proxy
*/
Moon = function() {
  this.velocity = [-0.0006, 0.0];
  this.position = [0.0, 0.0, 0.0];
  return this;
};
Moon.prototype.render = function(gl, view, projection, time) {
  var cosAzim, cosIncl, orbit, sinAzim, sinIncl;
  orbit = [Math.PI * 0.1 + this.velocity[0] * time, Math.PI * -0.14 + this.velocity[1] * time];
  if (!MoonModule.vertexBuffer) {
    MoonModule.createResources(gl);
  }
  cosIncl = Math.cos(orbit[0]);
  sinIncl = Math.sin(orbit[0]);
  cosAzim = Math.cos(orbit[1]);
  sinAzim = Math.sin(orbit[1]);
  this.position = [cosIncl * sinAzim, cosIncl * cosAzim, sinIncl];
  return MoonModule.render(gl, view, projection, this.position);
};var Sun, SunModule;
/*
A proxy for the sun
*/
/*
Sun Module
*/
SunModule = {
  vertexBuffer: null,
  textureCoordBuffer: null,
  shaderProgram: null,
  texture: null,
  createResources: function(gl) {
    var fragmentShader, textureCoords, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    textureCoords = [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "sun-vs");
    fragmentShader = compileShader(gl, "sun-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    this.shaderProgram.textureCoord = gl.getAttribLocation(this.shaderProgram, "textureCoord");
    gl.enableVertexAttribArray(this.shaderProgram.textureCoord);
    this.shaderProgram.pos = gl.getUniformLocation(this.shaderProgram, "pos");
    this.shaderProgram.view = gl.getUniformLocation(this.shaderProgram, "view");
    this.shaderProgram.projection = gl.getUniformLocation(this.shaderProgram, "projection");
    this.shaderProgram.exposure = gl.getUniformLocation(this.shaderProgram, "exposure");
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
      if (this.textureCoordBuffer) {
        this.textureCoordBuffer.destroy();
      }
    }
    return null;
  },
  render: function(gl, view, projection, pos) {
    var k, saveState, shaderProgram;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    shaderProgram = this.shaderProgram;
    gl.useProgram(shaderProgram);
    for (k = 2; k <= 7; k++) {
      gl.disableVertexAttribArray(k);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.enableVertexAttribArray(shaderProgram.textureCoord);
    gl.vertexAttribPointer(shaderProgram.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(shaderProgram.pos, pos[0], pos[1], pos[2]);
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view));
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection));
    gl.uniform1f(shaderProgram.exposure, 0.4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return SunModule.destroyResources();
});
/*
Sun proxy
*/
Sun = function() {
  this.velocity = [0.0005, 0.0];
  this.position = [0.0, 0.0, 0.0];
  return this;
};
Sun.prototype.render = function(gl, view, projection, time) {
  var cosAzim, cosIncl, orbit, sinAzim, sinIncl;
  orbit = [Math.PI * 0.3 + this.velocity[0] * time, Math.PI * 0.9 + this.velocity[1] * time];
  if (!SunModule.vertexBuffer) {
    SunModule.createResources(gl);
  }
  cosIncl = Math.cos(orbit[0]);
  sinIncl = Math.sin(orbit[0]);
  cosAzim = Math.cos(orbit[1]);
  sinAzim = Math.sin(orbit[1]);
  this.position = [cosIncl * sinAzim, cosIncl * cosAzim, sinIncl];
  return SunModule.render(gl, view, projection, this.position);
};var DaisClouds, DaisCloudsModule, DaisCloudsNode;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
A scenejs extension that renders a cloud particles around the daises
*/
/*
Dais Clouds Module
*/
DaisCloudsModule = {
  vertexBuffer: null,
  shaderProgram: null,
  numParticles: 200,
  createResources: function(gl) {
    var _a, fragmentShader, k, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [];
    _a = (this.numParticles * 3 - 1);
    for (k = 0; (0 <= _a ? k <= _a : k >= _a); (0 <= _a ? k += 1 : k -= 1)) {
      vertices[k] = ((Math.random() - 0.5) * 2.0) * ((Math.random() - 0.5) * 2.0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "cloudparticle-vs");
    fragmentShader = compileShader(gl, "cloudparticle-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    this.shaderProgram.view = gl.getUniformLocation(this.shaderProgram, "view");
    this.shaderProgram.projection = gl.getUniformLocation(this.shaderProgram, "projection");
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
    }
    return null;
  },
  render: function(gl, view, projection) {
    var k, saveState, shaderProgram;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    shaderProgram = this.shaderProgram;
    gl.useProgram(shaderProgram);
    for (k = 1; k <= 7; k++) {
      gl.disableVertexAttribArray(k);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view));
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection));
    gl.drawArrays(gl.POINTS, 0, this.numParticles);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    gl.depthMask(true);
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return DaisCloudsModule.destroyResources();
});
/*
Dias clouds node type
*/
DaisCloudsNode = SceneJS.createNodeType("dais-clouds");
DaisCloudsNode.prototype._render = function(traversalContext) {
  if (SceneJS._traversalMode === SceneJS._TRAVERSAL_MODE_RENDER) {
    this._renderNodes(traversalContext);
    this.view = mulMat4(SceneJS._viewTransformModule.getTransform().matrix, SceneJS._modelTransformModule.getTransform().matrix);
    this.projection = SceneJS._projectionModule.getTransform().matrix;
  }
  return null;
};
DaisCloudsNode.prototype.getView = function() {
  return this.view;
};
DaisCloudsNode.prototype.getProjection = function() {
  return this.projection;
};
/*
Dias clouds proxy
*/
DaisClouds = function(index) {
  this.node = {
    type: "dais-clouds",
    id: "dais" + index + "clouds"
  };
  return this;
};
DaisClouds.prototype.withNode = function() {
  return SceneJS.withNode(this.node.id);
};
DaisClouds.prototype.render = function(gl, time) {
  var nodeRef, projection, view;
  nodeRef = this.withNode();
  view = nodeRef.get("view");
  projection = nodeRef.get("projection");
  if (!DaisCloudsModule.vertexBuffer) {
    DaisCloudsModule.createResources(gl);
  }
  return DaisCloudsModule.render(gl, view, projection);
};var Atmosphere, AtmosphereModule;
/*
Copyright 2010, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
*/
/*
A scenejs extension that renders the atmosphere (atmospheric scattering) using a full-screen quad and some procedural shaders.
*/
/*
Atmosphere Module
*/
AtmosphereModule = {
  vertexBuffer: null,
  indexBuffer: null,
  shaderProgram: null,
  transmittanceProgram: null,
  transmittanceTexture: null,
  createTransmittanceResources: function(gl) {
    var fragmentShader, frameBuffer, textureHeight, textureWidth, vertexShader;
    this.transmittanceProgram = gl.createProgram();
    vertexShader = compileShader(gl, "fullscreenquad-vs");
    fragmentShader = compileShader(gl, "atmosphere-hi-transmittance-fs");
    gl.attachShader(this.transmittanceProgram, vertexShader);
    gl.attachShader(this.transmittanceProgram, fragmentShader);
    gl.linkProgram(this.transmittanceProgram);
    if (!gl.getProgramParameter(this.transmittanceProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.transmittanceProgram);
    this.transmittanceProgram.vertexPosition = gl.getAttribLocation(this.transmittanceProgram, "vertexPosition");
    textureWidth = 256;
    textureHeight = 64;
    this.transmittanceTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.transmittanceTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.enableVertexAttribArray(this.transmittanceProgram.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.transmittanceTexture, 0);
    gl.viewport(0, 0, textureWidth, textureHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(frameBuffer);
    return null;
  },
  createResourcesHi: function(gl) {
    var fragmentShader, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "fullscreenquad-vs");
    fragmentShader = compileShader(gl, "atmosphere-hi-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    this.shaderProgram.camera = gl.getUniformLocation(this.shaderProgram, "camera");
    this.shaderProgram.sun = gl.getUniformLocation(this.shaderProgram, "sun");
    this.shaderProgram.invProjection = gl.getUniformLocation(this.shaderProgram, "invProjection");
    this.shaderProgram.invView = gl.getUniformLocation(this.shaderProgram, "invView");
    this.shaderProgram.exposure = gl.getUniformLocation(this.shaderProgram, "exposure");
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    return null;
  },
  renderHi: function(gl, invView, invProjection, sun) {
    var saveState;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    gl.useProgram(this.shaderProgram);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(this.shaderProgram.camera, 0.0, 0.0, 1.0);
    gl.uniform3fv(this.shaderProgram.sun, sun);
    gl.uniformMatrix4fv(this.shaderProgram.invProjection, false, new Float32Array(invProjection));
    gl.uniformMatrix4fv(this.shaderProgram.invView, false, new Float32Array(invView));
    gl.uniform1f(this.shaderProgram.exposure, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    gl.depthMask(true);
    return null;
  },
  createResourcesLo: function(gl) {
    var _a, _b, cx, cy, fragmentShader, indices, nx, ny, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    nx = 4 * 15;
    ny = 3 * 15;
    vertices = new Array((ny + 1) * (nx + 1) * 2);
    for (cy = 0; (0 <= ny ? cy <= ny : cy >= ny); (0 <= ny ? cy += 1 : cy -= 1)) {
      for (cx = 0; (0 <= nx ? cx <= nx : cx >= nx); (0 <= nx ? cx += 1 : cx -= 1)) {
        vertices[(cy * (nx + 1) + cx) * 2 + 0] = -1.0 + (cx * 2) / nx;
        vertices[(cy * (nx + 1) + cx) * 2 + 1] = -1.0 + (cy * 2) / ny;
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    indices = new Array(ny * nx * 6);
    _a = (ny - 1);
    for (cy = 0; (0 <= _a ? cy <= _a : cy >= _a); (0 <= _a ? cy += 1 : cy -= 1)) {
      _b = (nx - 1);
      for (cx = 0; (0 <= _b ? cx <= _b : cx >= _b); (0 <= _b ? cx += 1 : cx -= 1)) {
        indices[(cy * nx + cx) * 6 + 0] = ((cy + 0) * (nx + 1) + cx + 0);
        indices[(cy * nx + cx) * 6 + 1] = ((cy + 0) * (nx + 1) + cx + 1);
        indices[(cy * nx + cx) * 6 + 2] = ((cy + 1) * (nx + 1) + cx + 0);
        indices[(cy * nx + cx) * 6 + 3] = ((cy + 0) * (nx + 1) + cx + 1);
        indices[(cy * nx + cx) * 6 + 4] = ((cy + 1) * (nx + 1) + cx + 1);
        indices[(cy * nx + cx) * 6 + 5] = ((cy + 1) * (nx + 1) + cx + 0);
      }
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "atmosphere-lo-vs");
    fragmentShader = compileShader(gl, "atmosphere-lo-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    this.shaderProgram.invProjection = gl.getUniformLocation(this.shaderProgram, "invProjection");
    this.shaderProgram.invView = gl.getUniformLocation(this.shaderProgram, "invView");
    this.shaderProgram.sun = gl.getUniformLocation(this.shaderProgram, "sun");
    this.shaderProgram.invWavelength = gl.getUniformLocation(this.shaderProgram, "invWavelength");
    this.shaderProgram.cameraHeight = gl.getUniformLocation(this.shaderProgram, "cameraHeight");
    this.shaderProgram.cameraHeightSqr = gl.getUniformLocation(this.shaderProgram, "cameraHeightSqr");
    this.shaderProgram.innerRadius = gl.getUniformLocation(this.shaderProgram, "innerRadius");
    this.shaderProgram.outerRadiusSqr = gl.getUniformLocation(this.shaderProgram, "outerRadiusSqr");
    this.shaderProgram.KrESun = gl.getUniformLocation(this.shaderProgram, "KrESun");
    this.shaderProgram.KmESun = gl.getUniformLocation(this.shaderProgram, "KmESun");
    this.shaderProgram.Kr4PI = gl.getUniformLocation(this.shaderProgram, "Kr4PI");
    this.shaderProgram.Km4PI = gl.getUniformLocation(this.shaderProgram, "Km4PI");
    this.shaderProgram.scale = gl.getUniformLocation(this.shaderProgram, "scale");
    this.shaderProgram.scaleDepth = gl.getUniformLocation(this.shaderProgram, "scaleDepth");
    this.shaderProgram.scaleDivScaleDepth = gl.getUniformLocation(this.shaderProgram, "scaleDivScaleDepth");
    this.shaderProgram.g = gl.getUniformLocation(this.shaderProgram, "g");
    this.shaderProgram.gSqr = gl.getUniformLocation(this.shaderProgram, "gSqr");
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    return null;
  },
  renderLo: function(gl, view, invProjection, nearZ, sun) {
    var ESun, Km, Km4PI, Kr, Kr4PI, cameraHeight, innerRadius, nx, ny, outerRadius, rayleighScaleDepth, saveState, scale, wavelength, wavelength4;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.disable(gl.BLEND);
    gl.depthMask(false);
    gl.useProgram(this.shaderProgram);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.shaderProgram.invProjection, invProjection[0] / nearZ, invProjection[5] / nearZ);
    gl.uniformMatrix3fv(this.shaderProgram.invView, false, new Float32Array(transposeMat3(view)));
    Kr = 0.0025;
    Kr4PI = Kr * 4.0 * Math.PI;
    Km = 0.0010;
    Km4PI = Km * 4.0 * Math.PI;
    ESun = 20.0;
    cameraHeight = 10.05;
    innerRadius = 10.0;
    outerRadius = 10.25;
    scale = 1.0 / (outerRadius - innerRadius);
    wavelength = [0.650, 0.570, 0.475];
    wavelength4 = [square(square(wavelength[0])), square(square(wavelength[1])), square(square(wavelength[2]))];
    rayleighScaleDepth = 0.25;
    gl.uniform3fv(this.shaderProgram.sun, new Float32Array(sun));
    gl.uniform3f(this.shaderProgram.invWavelength, 1.0 / wavelength4[0], 1.0 / wavelength4[1], 1.0 / wavelength4[2]);
    gl.uniform1f(this.shaderProgram.cameraHeight, cameraHeight);
    gl.uniform1f(this.shaderProgram.cameraHeightSqr, cameraHeight * cameraHeight);
    gl.uniform1f(this.shaderProgram.innerRadius, innerRadius);
    gl.uniform1f(this.shaderProgram.outerRadiusSqr, outerRadius * outerRadius);
    gl.uniform1f(this.shaderProgram.KrESun, Kr * ESun);
    gl.uniform1f(this.shaderProgram.KmESun, Km * ESun);
    gl.uniform1f(this.shaderProgram.Kr4PI, Kr4PI);
    gl.uniform1f(this.shaderProgram.Km4PI, Km4PI);
    gl.uniform1f(this.shaderProgram.scale, scale);
    gl.uniform1f(this.shaderProgram.scaleDepth, rayleighScaleDepth);
    gl.uniform1f(this.shaderProgram.scaleDivScaleDepth, scale / rayleighScaleDepth);
    gl.uniform1f(this.shaderProgram.g, -0.990);
    gl.uniform1f(this.shaderProgram.gSqr, -0.990 * -0.990);
    nx = 4 * 15;
    ny = 3 * 15;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, ny * nx * 6, gl.UNSIGNED_SHORT, 0);
    if (saveState.blend) {
      gl.enable(gl.BLEND);
    }
    gl.depthMask(true);
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return AtmosphereModule.destroyResources();
});
/*
Cloud dome node type
*/
Atmosphere = function() {};
Atmosphere.prototype.render = function(gl, view, invProjection, nearZ, sun) {
  if (!AtmosphereModule.vertexBuffer) {
    AtmosphereModule.createResourcesLo(gl);
  }
  AtmosphereModule.renderLo(gl, view, invProjection, nearZ, sun);
  return null;
};
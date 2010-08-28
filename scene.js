var cameraConfig, gameScene, guiLightsConfig, guiLookAtConfig, guiNode, numberedDaisNode, sceneLightsConfig, sceneLookAtConfig, sceneLookAtNode;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
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
sceneLookAtConfig = {
  id: "SceneLookAt",
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
}, level.platformsNode, SceneJS.stationary(skybox.node))));
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
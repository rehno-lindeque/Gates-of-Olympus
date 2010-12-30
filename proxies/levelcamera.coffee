
###
The camera proxy
###

class LevelCamera
  constructor: (levelNode) ->
    @optics = 
      type:   "ortho"
      left:   -12.5 * (canvasSize[0] / canvasSize[1])
      right:   12.5 * (canvasSize[0] / canvasSize[1])
      bottom: -12.5
      top:     12.5
      near:    0.1
      far:     300.0
    @node = 
      type: "camera"
      id:   "sceneCamera"
      optics: @optics
      nodes: [
          type:      "light"
          id:        "levelLight"
          mode:      "dir"
          color:     { r: 1.0, g: 1.0, b: 1.0 }
          diffuse:   true
          specular:  false
          dir:       { x: 1.0, y: 1.0, z: -1.0 }
        ,
          type: "matrix"
          elements: [
            1.0, 0.0, 0.0, 0.0
            0.0, 1.0, 0.0, 0.0
            0.0, 0.0, 1.0, platformScaleFactor
            0.0, 0.0, 0.0, 1.0
          ]
          nodes: [ levelNode ]
        ]
  
  withNode: -> SceneJS.withNode "sceneCamera"

  withLightNode: -> SceneJS.withNode "levelLight"
  
  reconfigure: (canvasSize) -> 
    @optics.left  = -12.5 * (canvasSize[0] / canvasSize[1])
    @optics.right =  12.5 * (canvasSize[0] / canvasSize[1])
    @withNode().set("optics", @optics)
  
  updateLight: (color, lightDir) -> 
    @withLightNode()
      .set("color", {r: color[0], g: color[1], b: color[2]})
      .set("dir", {x: lightDir[0], y: lightDir[1], z: lightDir[2]})

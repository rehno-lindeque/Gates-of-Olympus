
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
          mode:      "dir"
          color:     { r: 1.0, g: 1.0, b: 1.0 }
          diffuse:   true
          specular:  false
          dir:       { x: 1.0, y: 1.0, z: -1.0 }
        ,
          levelNode
        ]
  
  withCamera: -> SceneJS.withNode "sceneCamera"
  
  reconfigure: -> @withCamera().set("optics", @optics)
  

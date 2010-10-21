###
Background proxies
###

###
class A
  constructor: ->
    @x = 
      a: [
        b: [ 
          c: 1
        ]
      ]
  
  foo: ->
    alert "test"
###
 
class BackgroundCamera
  constructor: (backgroundNode) ->
    @optics = 
      type:   "perspective"
      fovy:   25.0
      aspect: canvasSize[0] / canvasSize[1]
      near:   0.10
      far:    300.0
    @node = @createNode(backgroundNode)
  
  withNode: -> SceneJS.withNode "backgroundCamera"
  
  reconfigure: -> @withNode().set("optics", @optics)
  
  createNode: (backgroundNode) ->
    type:   "camera"
    id:     "backgroundCamera"
    optics: @optics
    nodes: [
        type: "cloudDome"
        radius:  100.0
        nodes: [ 
            type: "stationary"
            nodes: [ backgroundNode ]  
          ]
      ]
  


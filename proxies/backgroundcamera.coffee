#
# Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
# This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
#

###
Background proxies
###

class BackgroundCamera
  constructor: (backgroundNode) ->
    @optics = 
      type:   "perspective"
      fovy:   25.0
      aspect: canvasSize[0] / canvasSize[1]
      near:   0.10
      far:    300.0
    @node = 
      type:   "camera"
      id:     "backgroundCamera"
      optics: @optics
      #nodes: [
      #  type: "cloud-dome"
      #  radius:  100.0
      #  nodes: [ 
      #    type: "stationary"
      #    nodes: [ backgroundNode ]  
      #  ]
      #]
  
  withNode: -> SceneJS.withNode "backgroundCamera"
  
  reconfigure: (canvasSize) -> 
    @optics.aspect = canvasSize[0] / canvasSize[1]
    @withNode().set("optics", @optics)
  

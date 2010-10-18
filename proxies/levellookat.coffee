###
The look-at proxy for the main game scene
###

class LevelLookAt
  constructor: (cameraNode, backgroundCameraNode) ->
    @angle = 0.0
    @radius = 10.0
    @config = 
      id:   "SceneLookAt"
      eye:  { x: 0.0, y: -@radius, z: 7.0 }
      look: { x: 0.0, y: 0.0, z: 0.0 }
      up:   { x: 0.0, y: 0.0, z: 1.0 }
    @lookAtNode = SceneJS.lookAt(@config, cameraNode)
    @backgroundLookAtNode = SceneJS.lookAt(@config, backgroundCameraNode)
    @node = 
      SceneJS.translate(
        { x: gameSceneOffset[0], y: gameSceneOffset[1], z: gameSceneOffset[2] }
        @lookAtNode
      ) # translate
  
  update: () ->
    cosAngle = Math.cos @angle
    cfg =
      x: (Math.sin @angle) * @radius
      y: cosAngle * -@radius
      z: 7.0
    @lookAtNode.setEye(cfg)
    @backgroundLookAtNode.setEye(cfg)

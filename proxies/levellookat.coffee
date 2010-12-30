###
The look-at proxy for the main game scene
###

class LevelLookAt
  constructor: (cameraNode, backgroundCameraNode) ->
    @angle = Math.PI * 0.25
    @radius = 10.0
    @lookAtNode = 
      type: "lookAt"
      id:   "SceneLookAt"
      #eye:  { x: 0.0, y: -@radius, z: 7.0 }
      eye:  { x: (Math.sin @angle) * @radius, y: (Math.cos @angle) * -@radius, z: 7.0 }
      look: { x: 0.0, y: 0.0, z: 0.0 }
      up:   { x: 0.0, y: 0.0, z: 1.0 }
      nodes: [ cameraNode ]
    @backgroundLookAtNode =
      type: "lookAt"
      id:   "BackgroundLookAt"
      eye:  { x: (Math.sin @angle) * @radius, y: (Math.cos @angle) * -@radius, z: 7.0 }
      look: { x: 0.0, y: 0.0, z: 0.0 }
      up:   { x: 0.0, y: 0.0, z: 1.0 }
      nodes: [ backgroundCameraNode ]
    @node = 
      nodes: [
        type: "translate"
        x: gameSceneOffset[0], y: gameSceneOffset[1], z: gameSceneOffset[2]
        nodes: [ @lookAtNode ]
      ]
  
  withSceneLookAt: -> SceneJS.withNode "SceneLookAt"
  withBackgroundLookAt: -> SceneJS.withNode "BackgroundLookAt"
  
  update: ->
    @lookAtNode.eye = { x: (Math.sin @angle) * @radius, y: (Math.cos @angle) * -@radius, z: 7.0 }
    @backgroundLookAtNode.eye = @lookAtNode.eye
    @withSceneLookAt().set("eye", @lookAtNode.eye)
    @withBackgroundLookAt().set("eye", @lookAtNode.eye)

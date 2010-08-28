###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

class Skybox
  constructor: () ->
    @node = 
      SceneJS.createNode(
        type: "scale"
        cfg:  { x: 100.0, y: 100.0, z: 100.0 },
        nodes: [
            type:           "material"
            cfg:
              baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
              specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
              specular:       0.0
              shine:          0.0
            nodes: [
                type: "texture"
                cfg: { layers: [{uri:"textures/sky.png"}] }
                nodes: [
                    type:       "geometry"
                    cfg:
                      primitive:  "triangles"
                      positions:  [1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1,-1, 1,-1,-1, 1, 1,-1, 1, 1,-1, 1,-1,-1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1, 1,-1, 1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1, 1,-1, 1, 1,-1]
                      uv:         [1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]
                      indices:    [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]
                  ]
              ]
          ])

skybox = new Skybox()


towerNode = (index, sid) -> 
  tex = SceneJS.texture({layers: [{uri: towerTextureURI[index]}]})
  SceneJS.material(
    baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
    specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
    specular:       0.0
    shine:          0.0
    tex
  ) # material
  tex

towerPlacementNode = () ->
  tower1 = towerNode(0, "placementTower"+0)
  tower1.addNode(SceneJS.instance {uri: towerURI[0]})
  tower2 = towerNode(1, "placementTower"+1)
  tower2.addNode(SceneJS.instance {uri: towerURI[1]})
  SceneJS.translate(
    { id: "placementTower", z: platformHeights[1] }
    SceneJS.selector(
      { sid: "placementTowerModel", selection: [0] }
      tower1
      tower2
    ) # selector
  ) # translate

class Level
  constructor: () ->
    @levelNodes = new Array 3
    @levelNodes[0] = {
      archerTowers:   towerNode(0, "archerTowers0")
      catapultTowers: towerNode(1, "catapultTowers0") }
    @levelNodes[1] = {
      archerTowers:   towerNode(0, "archerTowers1")
      catapultTowers: towerNode(1, "catapultTowers1") }
    @levelNodes[2] = {
      archerTowers:   towerNode(0, "archerTowers2")
      catapultTowers: towerNode(1, "catapultTowers2") }
    
    @platformsNode =   
      SceneJS.material(
        #baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
        baseColor:      { r: 0.75, g: 0.78, b: 0.85 }
        specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
        specular:       0.9
        shine:          6.0
        towerPlacementNode()
        SceneJS.translate(
          { z: platformHeights[0] }
          SceneJS.scale(
            { x: 0.78, y: 0.78, z: 0.78 }
            platformGeometry("level0")
            @levelNodes[0].archerTowers
            @levelNodes[0].catapultTowers
          ) # scale
        ) # translate
        SceneJS.translate(
          { z: platformHeights[1] }
          platformGeometry("level1")
          @levelNodes[1].archerTowers
          @levelNodes[1].catapultTowers
        ) #translate
        SceneJS.translate(
          {z:platformHeights[2]}
          SceneJS.scale(
            { x: 1.22, y: 1.22, z: 1.22 }
            platformGeometry("level2")
            @levelNodes[2].archerTowers
            @levelNodes[2].catapultTowers
          ) # scale
        ) # translate
      ) # material  (platforms)
    
level = new Level()

#sceneLookAtConfig = 
#  id:   "SceneLookAt"
#  eye:  { x: 0.0, y: 10.0, z: 7.0 }
#  look: { x: 0.0, y: 0.0 }
#  up:   { z: 1.0 }
#
#class SceneLookAt
#  constructor: () ->
#    @node = 
#      SceneJS.lookAt(
#        sceneLookAtConfig
#        SceneJS.camera(
#          cameraConfig
#          SceneJS.translate(
#            x: 3.0
#            platformsNode
#            SceneJS.stationary(skyboxNode)
#          ) # translate
#        ) # camera
#      ) # lookAt

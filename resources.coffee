###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Tower resources
###

towerURI = ["../ArcherTower", "../CatapultTower", "../LightningTower"]
towerTextureURI = ["textures/archer.jpg", "textures/catapult.jpg", "textures/lightning.jpg"]


###
Platform resources
###

platformGeometry = (type) -> 
  s = gridSize * cellScale * 0.5  # scale size of the grid in world space
  SceneJS.geometry({
    type: type
    primitive: "triangles"
    positions: [
        -s,  s,  0
         s,  s,  0
         s, -s,  0
        -s, -s,  0
      ]
    indices: [0,  1,  2, 0, 2, 3]
  })


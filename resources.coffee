###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Tower resources
###

towerIds = ["ArcherTower", "CatapultTower", "BallistaTower"]
towerTextureURI = ["textures/archer.jpg", "textures/catapult.jpg", "textures/ballista.jpg"]

###
Platform resources
###

platformGeometry = (platformId) -> 
  s = gridSize * cellScale * 0.5  # scale size of the grid in world space
  
  type:   "geometry"
  resource: platformId
  id: platformId
  primitive: "triangles"
  positions: [
      -s,  s,  0
       s,  s,  0
       s, -s,  0
      -s, -s,  0
    ]
  indices: [0,  1,  2, 0, 2, 3]


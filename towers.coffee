###
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Tower types
###

archerRadiusSQR = 1.0

archerTowerUpdate = (index) ->
# find the closest creep and damage him
# later, decide the exact functionality
# also we will have to optimize like use grids for creep caching
  ###
  towerX = index % gridSize
  towerY = index / gridSize
  towerLevel = index / sqrGridSize
  towerPos = indexToPosition(towerX, towerY, towerLevel)
  for c in level.creatures.creatures
    distX = c.pos[0] - towerPos.x
    distY = c.pos[1] - towerPos.y
    distSQR = distX*distX + distY*distY
    if (distSQR < archerRadiusSQR)
    
    ###

  
  
catapultTowerUpdate = (index) ->
  
  
### 
Tower class
###

class Tower
  


###
Collection of all towers
###

class Towers
  constructor: ->
    SceneJS.createNode BlenderExport.ArcherTower
    SceneJS.createNode BlenderExport.CatapultTower
    SceneJS.createNode BlenderExport.BallistaTower
    
    @towers = new Array (sqrGridSize * levels)
    for c in [0...(sqrGridSize * levels)]
      @towers[c] = -1
      
    # For testing only: Place holes

    @towers[levelGoals[0]] = -2
    @towers[levelGoals[1]] = -2
    @towers[levelGoals[2]] = -2
      
  update: ->
    # for now lets just switch on the tower id to decide the logic, can do this better later if necessaary
    # should keep a list of towers, but for testing this is fine
    #for c in [0...(sqrGridSize * levels)]
      #switch @towers[c]
        #when 0 archerTowerUpdate(c)
        #when 1 catapultTowerUpdate(c)


        


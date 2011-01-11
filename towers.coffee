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
    
    # Create a grid of towers
    @towers = new Array (sqrGridSize * levels)
    for c in [0...sqrGridSize * levels]
      @towers[c] = -1

    # Create a grid of create targets (corresponding to towers on the same grid)
    @targets = new Array (sqrGridSize * levels)
    for c in [0...sqrGridSize * levels]
      @targets[c] = null

    # Create a grid of delay time
    @delays = new Array (sqrGridSize * levels)
    for c in [0...sqrGridSize * levels]
      @delays[c] = 0.0
      
    # For testing only: Place holes
    @towers[levelGoals[0]] = -2
    @towers[levelGoals[1]] = -2
    @towers[levelGoals[2]] = -2
  
  update: ->
    # Fire projectiles at creatures and inflict damage
    platformCenters = [ 
      #gridToPosition(gridSize / 2, gridSize / 2, 0)
      #gridToPosition(gridSize / 2, gridSize / 2, 1)
      #gridToPosition(gridSize / 2, gridSize / 2, 2)
      [0.0, 0.0, platformHeights[0]]
      [0.0, 0.0, platformHeights[1]]
      [0.0, 0.0, platformHeights[2]]
    ]
    for clevel in [0...levels]
      for cy in [0...gridSize]
        for cx in [0...gridSize]
          c = clevel * sqrGridSize + cy * gridSize + cx
          if @delays[c] > 0.0
            @delays[c] -= 1.0 # todo change this to the timeline dt
          if @targets[c] != null && @delays[c] <= 0.0 && @targets[c].health > 0 && Math.abs(@targets[c].pos[2] - (platformHeights[clevel] - platformHeightOffset)) < 0.5
            origin = gridToPosition(cx,cy,clevel)
            targetVec = subVec3(@targets[c].pos, origin)
            targetVec[2] = 0.1;
            origin[2] = 0.5;
            level.projectiles[clevel][0].add(
              #subVec3(origin, platformCenters[clevel])
              origin
              targetVec
            )
            @targets[c].damage(10)
            @delays[c] = 50.0
          @targets[c] = null
    null
  
  # Let a creature present itself to the surrounding towers as a target...
  # TODO: this should be replaced with a better method in the future (this is just temporary for the competition
  present: (creature) -> 
    gridPos = positionToGrid(creature.pos[0],creature.pos[1])
    for cy in [max(gridPos[1]-1,0)..min(gridPos[1]+1,gridSize-1)]
      for cx in [max(gridPos[0]-1,0)..min(gridPos[0]+1,gridSize-1)]
        index = creature.level * sqrGridSize + cy * gridSize + cx
        if @targets[index] == null && @towers[index] >= 0
          @targets[index] = creature
    null


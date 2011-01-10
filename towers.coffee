###
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Tower types
###

archerTowerUpdate = (index) ->
  
  
catapultTowerUpdate = (index) ->
  


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
    # for now lets just switch on the tower id to decide the logic, can do this better later if necessaary
    #for c in [0...(sqrGridSize * levels)]
      #switch @towers[c]
        #when 0 archerTowerUpdate(c)
        #when 1 catapultTowerUpdate(c)
    for c in [0...sqrGridSize * levels]
      @targets[c] = null
  
  # Let a creature present itself to the surrounding towers as a target...
  # TODO: this should be replaced with a better method in the future (this is just temporary for the competition
  present: (creature) -> 
    gridPos = positionToGrid(creature.pos[0],creature.pos[1])
    for cy in [max(gridPos[1]-1,0)..min(gridPos[1]+1,gridSize-1)]
      for cx in [max(gridPos[0]-1,0)..min(gridPos[0]+1,gridSize-1)]
        index = creature.level * sqrGridSize + cy * gridSize + cx
        if @targets[index] == null && @towers[index] >= 0
          @targets[index] = creature


###
Copyright 2010, Rehno Lindeque.
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
    
    @towers = new Array (sqrGridSize * levels)
    for c in [0...(sqrGridSize * levels)]
      @towers[c] = -1
      
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

    


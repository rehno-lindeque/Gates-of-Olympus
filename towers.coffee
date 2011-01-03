###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Tower types
###


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
    @towers[sqrGridSize-23] = -2
    @towers[sqrGridSize + 15] = -2
    @towers[2*sqrGridSize + 32] = -2

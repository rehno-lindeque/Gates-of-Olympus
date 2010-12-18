###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Creature types
###

class Creature
  create: () ->
    @pos = [0.0,0.0,platformHeights[0]-1.75]
    @rot = 0.0
    @level = 0
    #@node = null
    @index = 6+ 6*gridSize
    @health = 0
    null

class Scorpion extends Creature
  constructor: () ->
    @create()
  
  create: () ->
    super()

###
Collection of all creatures
###

class Creatures
  constructor: () ->
    SceneJS.createNode BlenderExport.Scorpion
    @creatures = new Array()
    #@geometries = new Array()
    #@geometries[0] = SceneJS.createNode BlenderExport.Scorpion
    @node = 
      type:           "material"
      id:             "creatures"
      baseColor:      { r: 0.3, g: 0.1, b: 0.1 }
      specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
      specular:       0.0
      shine:          0.0
  
  addCreature: (CreaturePrototype) ->
    creature = new CreaturePrototype
    @creatures[@creatures.length] = creature
    SceneJS.withNode("creatures").add("nodes", [
      type: "translate"
      x: creature.pos[0], y: creature.pos[1], z: creature.pos[2]
      nodes: [
        type: "rotate",
        angle: 0.0, z: 1.0
        nodes: [ type: "instance", target:"Scorpion" ]
      ]
    ])
    creature
  

  
  update: ->
    c = 0
    creatures = @creatures
    #floyd()
    
    floodInit()
    start = 6+ 0*gridSize
    goal  = 6+ 11*gridSize
    x = creatures[c].pos[0]
    y = creatures[c].pos[1]
    index = positionToIndex(x,y) 
    creatures[c].index = index
   
    if (index != goal)
      
      vel = getMove(creatures[c].pos[0],creatures[c].pos[1],creatures[c].level)
      ###
      if (!vel? || dirtyLevel[creatures[c].level])
        floodFillGenPath(index,goal)
        vel = getMove(creatures[c].pos[0],creatures[c].pos[1], goal)
      ###
      
      creatures[c].pos[0] = x + vel.x*0.1
      creatures[c].pos[1] = y + vel.y*0.1
      creatures[c].rot = 180*Math.atan2(vel.y,vel.x)/Math.PI - 90
    else 
      resetPos = indexToPosition(6,1)
      creatures[c].pos[0] = resetPos.x
      creatures[c].pos[1] = resetPos.y
      creatures[c].level  = 0 
      creatures[c].pos[2] = platformHeights[creatures[c].level] - 1.75
      creatures[c].index = positionToIndex(resetPos.x,resetPos.y)
      dirtyLevel[0] = true  # temp hack
      
    SceneJS.withNode("creatures").eachNode(
      () -> 
        this.set({x: creatures[c].pos[0], y: creatures[c].pos[1], z: creatures[c].pos[2]})
        this.node(0).set("angle", creatures[c].rot)
        #todo: c += 1
      {}
    )
    null


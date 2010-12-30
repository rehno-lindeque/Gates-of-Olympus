###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Creature types
###

class Creature
  create: () ->
    @pos = [0.0,0.0,0.0]
    @rot = 0.0
    @level = 0
    #@node = null
    @index = 6+ 6*gridSize
    @health = 0
    null
    
  getId: -> creatureIds[@index]
  getTextureURI: -> creatureTextureURI[@index]

class Scorpion extends Creature
  constructor: () ->
    @create()
    @index = 0
  
  create: () ->
    super()

class Fish extends Creature
  constructor: () ->
    @create()
    @index = 1
  
  create: () ->
    super()
  
  
###
Collection of all creatures
###

class Creatures
  constructor: () ->
    @creatures = new Array()
    SceneJS.createNode BlenderExport.Scorpion
    SceneJS.createNode BlenderExport.Fish
    #@geometries = new Array()
    #@geometries[0] = SceneJS.createNode BlenderExport.Scorpion
    @node = 
      type:           "material"
      id:             "creatures"
      baseColor:      { r: 0.0, g: 0.0, b: 0.0 }
      specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
      specular:       0.0
      shine:          0.0
      nodes: [
        type: "texture"
        id:   creatureIds[0] + "tex"
        layers: [ uri: creatureTextureURI[0] ]
      ,
        type: "texture"
        id:   creatureIds[1] + "tex"
        layers: [ uri: creatureTextureURI[1] ]
      ]
  
  addCreature: (CreaturePrototype) ->
    creature = new CreaturePrototype
    @creatures[@creatures.length] = creature
    SceneJS.withNode("creatures").node(creature.index).add("nodes", [
      type: "translate"
      x: creature.pos[0], y: creature.pos[1], z: creature.pos[2]
      nodes: [
        type: "rotate"
        angle: 0.0, z: 1.0
        nodes: [ type: "instance", target: creature.getId() ]
      ]
    ])
    creature

  
  update: ->
    c = 0
    creatures = @creatures
    #floyd()
    ###
    floodInit()
    start = 6+ 0*gridSize
    goal  = 6+ 11*gridSize
    x = creatures[c].pos[0]
    y = creatures[c].pos[1]
    index = positionToIndex(x,y) 
    creatures[c].index = index
   
    if (index != goal)
      
      vel = getMove(creatures[c].pos[0],creatures[c].pos[1],creatures[c].level)
      
      #if (!vel? || dirtyLevel[creatures[c].level])
      #  floodFillGenPath(index,goal)
      #  vel = getMove(creatures[c].pos[0],creatures[c].pos[1], goal)
            
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
    ###
    SceneJS.withNode("creatures").eachNode(
      () -> 
        this.eachNode(
          () ->        
            this.set({x: creatures[c].pos[0], y: creatures[c].pos[1], z: creatures[c].pos[2]})
            this.node(0).set("angle", creatures[c].rot)
            #todo: c += 1
          {}
        )
      {}
    )
    null
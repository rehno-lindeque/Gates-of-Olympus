###
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Creature types
###

#make array with max hp for each creep at id
###
creatureMaxHP = new Array(numCreatureTypes)
creatureMaxHP[0] = 120
creatureMaxHP[1] = 80
creatureMaxHP[2] = 100
###

# For now I'm just going to let each creature initialize itself.  This can later maybe be replaced by a spawn()
# function which does the initialization.  But for now this will do.
class Creature
  create: () ->
    @pos = [0.0,0.0,platformHeights[0] + 10.0]
    @rot = 0.0
    @level = 0
    #@node = null
    @gridIndex = 11+ 11*gridSize
    @maxHealth = 100
    @health = 100
    @state = 0            # 0 = Fall, 1 = Roam, 2 = Done, 3 = Dead
    @speed = 0.1
    @fallVelocity = [0.0,0.0,-@speed]
    null
    
  getId: -> creatureIds[@index]
  getTextureURI: -> creatureTextureURI[@index]
  
  getGridIndex: ->
    index = positionToIndex(@pos[0],@pos[1],@level) 
    @gridIndex = index
    return index
  
  
  # generic update function.  each subclass can also override this if necessary, or perhaps just implement certain methods
  # such as moveToPosition(), which it can then handle in its idiosyncratic manner.  For example the fish can duck and dive
  update: () ->
    # its very simple and hacky but for now its okay
    if @state == 0  # falling 
      # update falling
      # check if done falling
    
      @pos[0] += @fallVelocity[0]
      @pos[1] += @fallVelocity[1]
      @pos[2] += @fallVelocity[2]
      if (@pos[2] < (platformHeights[@level] - platformHeightOffset + 0.1)) # stop falling
        @state = 1 # roam
        #goal = levelGoals[level]
      
    else if @state == 1 # roaming
      tmp=1
      
      # update creature ai, check if dead or reached goal
      if (@gridIndex != levelGoals[@level])  # if the creature hasnt reached the goal on the current level 
        vel = getMove(@pos[0],@pos[1],@level)
        #if (!vel? || dirtyLevel[creatures[c].level])
        #  floodFillGenPath(index,goal)
        #  vel = getMove(creatures[c].pos[0],creatures[c].pos[1], goal)
            
        # this position update should perhaps be done in a function updatePosition(vel)
        # sub classes can then implement this in their own manner
        @pos[0] = @pos[0] + vel.x*@speed
        @pos[1] = @pos[1] + vel.y*@speed
        @rot = 180*Math.atan2(vel.y,vel.x)/Math.PI - 90
      else   # if creature has reached goal on current level
        if (@level == 2)
          @state = 2 # done
        else
          @state = 0 # falling
          @level++
          
          ###
          cellX = Math.floor(@gridIndex % gridSize)
          cellY = Math.floor(@gridIndex / gridSize) % gridSize
          g = indexToPosition(cellX, cellY, @level)
          dist = (platformHeights[@level] - platformHeightOffset + 0.1) - (platformHeights[@level-1] - platformHeightOffset + 0.1)
          dist = Math.abs(dist)
          fallTime = dist/@speed
          @fallVelocity.x = (g.x - @pos[0]) / fallTime
          @fallVelocity.y = (g.y - @pos[1]) / fallTime
          ###
          @fallVelocity.z = -@speed
            
    index = positionToIndex(@pos[0],@pos[1],@level) 
    @gridIndex = index
   
    
class Scorpion extends Creature
  constructor: () ->
    @create()
    @maxHealth = 100
    @health = @maxHealth
    @speed = 0.02
    @index = 0
    
  
  create: () ->
    super()

class Fish extends Creature
  constructor: () ->
    @create()
    @maxHealth = 80
    @health = @maxHealth
    @speed = 0.04
    @index = 1
  
  create: () ->
    super()

class Snake extends Creature
  constructor: () ->
    @create()
    @maxHealth = 120
    @health = @maxHealth
    @speed = 0.06
    @index = 2
  
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
    SceneJS.createNode BlenderExport.Snake
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
      ,
        type: "texture"
        id:   creatureIds[2] + "tex"
        layers: [ uri: creatureTextureURI[2] ]
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
        #type: "billboard",
        #id: "hpBar",
        #nodes: [
        #  type: "texture",
        #  layers: [ { uri: "textures/moon.png" } ]
        #  nodes: [
        #    type: "geometry",
        #    resource: "bill",
        #    primitive: "triangles",
        #    positions : [
        #      -0.5, 0.1, 0,
        #      -0.5, -0.1, 0,
        #      0.5,-0.1, 0,
        #      0.5,0.1, 0
        #    ],
        #    normals : [
        #      0, 1, 0,
        #      0, 1, 0,
        #      0, 1, 0,
        #      0, 1, 0
        #    ],
        #    uv : [
        #      0, 1,
        #      0, 0,
        #      1, 0,
        #      1, 1
        #    ],
        #    indices : [  
        #      0, 1, 2,
        #      0, 2, 3
        #    ]
        #  ]
        #]
      ]
    ])
  
  update: ->
    c = 0
    creatures = @creatures
    for creature in creatures
      creature.update()
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

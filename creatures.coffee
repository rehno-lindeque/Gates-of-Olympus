###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Creature types
###

class Creature
  create: (i) ->
    @pos = [0.0,0.0,0.0]
    @rot = 0.0
    #@node = null
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


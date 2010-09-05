###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Creature types
###

class Creature
  create: () ->
    @pos = [0,0,0]
    @rot = 0
    @node = null
    @health = 0

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
    @creatures = new Array()
    @geometries = new Array()
    @geometries[0] = BlenderExport.Scorpion()
    @node = 
      SceneJS.createNode(
        type:           "material"
        id:             "creatures"
        baseColor:      { r: 0.3, g: 0.1, b: 0.1 }
        specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
        specular:       0.0
        shine:          0.0
      )
  
  addCreature: (CreaturePrototype) ->
    creature = new CreaturePrototype
    @creatures[@creatures.length] = creature
    SceneJS.fireEvent(
      "configure"
      "creatures"
      cfg:
        "+node":
          type: "translate", x: creature.pos[0], y: creature.pos[1], z: creature.pos[2]
          nodes: [
              type: "instance", target:"Scorpion"
            ]
    )
    creature
  
  update: () ->
    c = 0
    for node in SceneJS.getNode("creatures").getNodes()
      node.setXYZ({x: @creatures[c].pos[0], y: @creatures[c].pos[1], z: @creatures[c].pos[2]})
      c += 1
    null

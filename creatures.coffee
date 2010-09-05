###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Creature types
###

class Creature
  create: () ->
    @position = [1.0,0.0,0.0]
    @rotation = 0
    @angle = 0
    @node = null
    @health = 0

class Scorpion extends Creature
  constructor: () ->
    @create()


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
          type: "translate" 
          x: -10
          y: -10
          z: 0
          nodes: [
              type: "instance"
              target:"Scorpion"
            ]
    )
    creature
  
  update: () ->
    c = 0
    for node in SceneJS.getNode("creatures").getNodes()
      #node.setXYZ(@creatures[c].position[0],@creatures[c].position[1],@creatures[c].position[2])
      node.setXYZ(10,10,10)
      c += 1
    null

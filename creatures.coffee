###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Creature types
###

class Creature
  constructor: () ->
    @position = [0,0,0]
    @rotation = 0
    @node = null
    @health = 0

class Scorpion extends Creature
  constructor: () ->
    null


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
        cfg:
          baseColor:      { r: 0.3, g: 0.1, b: 0.1 }
          specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
          specular:       0.0
          shine:          0.0
        #nodes: [
        #    type:       "geometry"
        #    cfg:
        #      primitive:  "triangles"
        #      positions:  [1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1,-1, 1,-1,-1, 1, 1,-1, 1, 1,-1, 1,-1,-1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1, 1,-1, 1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1, 1,-1, 1, 1,-1]
        #      uv:         [1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]
        #      indices:    [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]
        #    ]
      )
    #@node.addNode(@geometries[0])
  
  addCreature: (CreaturePrototype) ->
    @creatures[@creatures.length] = new CreaturePrototype
    SceneJS.fireEvent(
      "configure"
      "creatures"
      cfg:
        baseColor:      { r: 0.4, g: 0.2, b: 0.2 }
        specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
        specular:       0.0
        shine:          0.0
      cfg:
        "+node":
            type: "instance",
            cfg: {target:"Scorpion"}
    )



#
# Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
# This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
#

###
A proxy for dais tower selection gui element
###

guiDaisNode = (id, index) ->
  type: "translate"
  id: id
  x: index * 1.5
  nodes: [
      type: "translate"
      y: 2.5
      nodes: [
          type: "rotate"
          sid: "rotZ"
          angle: guiDaisRotPosition[index*2]
          z: 1.0
          nodes: [
              type: "rotate"
              sid: "rotX"
              angle: guiDaisRotPosition[index*2]
              x: 1.0
              nodes: [
                  type: "texture"
                  layers: [
                    { uri: "textures/dais1normals.png", applyTo: "normals" },
                    { uri: "textures/dais.jpg", applyTo: "baseColor" }]
                  nodes: [
                    type: "instance"
                    target: "NumberedDais"
                  ]
                ,
                  type: "texture"
                  layers: [{ uri: towerTextureURI[index] }]
                  nodes: [
                      type: "instance"
                      target: towerIds[index]
                    ]
                ]
            ]
        ]
    ]

class GUIDais
  constructor: (index) ->
    @index = index
    @id = "dais" + index
    @daisClouds = new DaisClouds(index)
    @node = graft(guiDaisNode(@id, index), [@daisClouds.node])
  
  update: ->
    SceneJS.withNode(@id)
      .node(0).node(0).set(
        angle: guiDaisRotPosition[@index*2]
        z: 1.0
      ).node(0).set(
        angle: guiDaisRotPosition[@index*2+1]
        x: 1.0
      )



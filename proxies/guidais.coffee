###
A proxy for dias tower selection gui element
###

guiDaisNode = (id, index) ->
  type: "translate"
  id: id
  x: index * 1.5
  nodes: [
      type: "rotate"
      sid: "rotZ"
      angle: guiDiasRotPosition[index*2]
      z: 1.0
      nodes: [
          type: "rotate"
          sid: "rotX"
          angle: guiDiasRotPosition[index*2]
          x: 1.0
          nodes: [
              type: "instance"
              target: "NumberedDais"
            ,
              type: "texture"
              layers: [{uri: towerTextureURI[index]}]
              nodes: [
                  type: "instance"
                  target: towerIds[index]
                ]
            ]
        ]
    ]

class GUIDais
  constructor: (index) ->
    @index = index
    @id = "dais" + index
    # @node = SceneJS.createNode guiDaisNode(@id, index)
    @node = guiDaisNode(@id, index)
  
  update: () ->
    SceneJS.fireEvent(
      "configure"
      @id
      cfg:
        "#rotZ":
          angle: guiDiasRotPosition[@index*2]
          z: 1.0
          "#rotX":
            angle: guiDiasRotPosition[@index*2+1]
            x: 1.0
    )



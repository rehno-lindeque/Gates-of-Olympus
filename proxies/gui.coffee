###
Top level GUI container
###

class GUI
  constructor: () ->
    @daises = new Array 2
    @daises[0] = new GUIDais 0
    @daises[1] = new GUIDais 1
    @daisGeometry = SceneJS.createNode BlenderExport.NumberedDais
    @lightConfig =
      type:      "dir"
      color:     { r: 1.0, g: 1.0, b: 1.0 }
      diffuse:   true
      specular:  false
      dir:       { x: 1.0, y: 1.0, z: -1.0 }
    @lookAt =
      type: "lookat"
      eye:  { x: 0.0, y: -10.0, z: 4.0 }
      look: { x: 0.0, y: 0.0 }
      up:   { z: 1.0 }
    @node =
      type: "translate"
      x: 8.0
      y: 4.0
      nodes: [
          type: "material"
          baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
          specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
          specular:       0.0
          shine:          0.0
        ,
          @daises[0].node
        ,
          @daises[1].node
        ]
  
  update: () ->
    @daises[0].update()
    @daises[1].update()

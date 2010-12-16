###
Top level GUI container
###

class GUI
  constructor: () ->
    @daises = new Array 2
    @daises[0] = new GUIDais 0
    @daises[1] = new GUIDais 1
    @daisGeometry = SceneJS.createNode BlenderExport.NumberedDais
    @selectedDais = -1
    @lightNode =
      type:      "light"
      mode:      "dir"
      color:     { r: 1.0, g: 1.0, b: 1.0 }
      diffuse:   true
      specular:  false
      #dir:       { x: 1.0, y: 1.0, z: -1.0 }
      dir:       { x: 0.3, y: 0.3, z: -1.0 }
    @lookAtNode =
      type: "lookAt"
      eye:  { x: 0.0, y: -10.0, z: 4.0 }
      look: { x: 0.0, y: 0.0 }
      up:   { z: 1.0 }
    @node =
      type: "translate"
      x: 8.0
      y: 4.0
      nodes: [
        type: "scale"
        x: 1.4
        y: 1.4
        z: 1.4
        nodes: [
          type: "material"
          baseColor:      { r: 0.0, g: 0.0, b: 0.0 }
          specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
          specular:       0.0
          shine:          0.0
          nodes: [
            @daises[0].node
            @daises[1].node
          ]
        ]
      ]

  initialize: ->
    SceneJS.withNode(@daises[0].id).bind("picked", (event) -> alert "#0 picked!")
    SceneJS.withNode(@daises[1].id).bind("picked", (event) -> alert "#1 picked!")
  
  update: ->
    @daises[0].update()
    @daises[1].update()
  
  selectDais: (daisNumber) ->
    if @selectedDais >= 0
      $("#daisStats #daisStats" + @selectedDais).removeClass("enabled")
      $("#daisStats #daisStats" + @selectedDais).addClass("disabled")
    @selectedDais = daisNumber
    $("#daisStats #daisStats" + daisNumber).removeClass("disabled")
    $("#daisStats #daisStats" + daisNumber).addClass("enabled")
    
  deselectDais: ->
    if @selectedDais >= 0
      $("#daisStats #daisStats" + @selectedDais).removeClass("enabled")
      $("#daisStats #daisStats" + @selectedDais).addClass("disabled")
    @selectedDais = -1
    

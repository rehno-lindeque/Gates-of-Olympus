###
Copyright 2010, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
###

###
Helpers for scenejs extension
###

# A global reference to the canvas for easy access to the WebGL context
canvas = null

SceneJS._eventModule.addListener(
  SceneJS._eventModule.SCENE_RENDERING
  () -> canvas = null
)

SceneJS._eventModule.addListener(
  SceneJS._eventModule.CANVAS_ACTIVATED
  (c) -> canvas = c
)

SceneJS._eventModule.addListener(
  SceneJS._eventModule.CANVAS_DEACTIVATED
  () -> canvas = null
)


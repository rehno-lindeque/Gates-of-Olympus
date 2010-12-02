var canvas;
/*
Copyright 2010, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
*/
/*
Helpers for scenejs extension
*/
canvas = null;
SceneJS._eventModule.addListener(SceneJS._eventModule.SCENE_RENDERING, function() {
  return (canvas = null);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.CANVAS_ACTIVATED, function(c) {
  return (canvas = c);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.CANVAS_DEACTIVATED, function() {
  return (canvas = null);
});
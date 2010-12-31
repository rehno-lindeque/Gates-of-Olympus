var Towers;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Tower types
*/
/*
Collection of all towers
*/
Towers = function() {
  var _ref, c;
  SceneJS.createNode(BlenderExport.ArcherTower);
  SceneJS.createNode(BlenderExport.CatapultTower);
  SceneJS.createNode(BlenderExport.BallistaTower);
  this.towers = new Array(sqrGridSize * levels);
  _ref = (sqrGridSize * levels);
  for (c = 0; (0 <= _ref ? c < _ref : c > _ref); (0 <= _ref ? c += 1 : c -= 1)) {
    this.towers[c] = -1;
  }
  this.towers[10] = -2;
  this.towers[sqrGridSize + 18] = -2;
  return this;
};
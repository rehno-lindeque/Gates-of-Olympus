var Towers, archerTowerUpdate, catapultTowerUpdate;
/*
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Tower types
*/
archerTowerUpdate = function(index) {};
catapultTowerUpdate = function(index) {};
/*
Collection of all towers
*/
Towers = function() {
  var c;
  SceneJS.createNode(BlenderExport.ArcherTower);
  SceneJS.createNode(BlenderExport.CatapultTower);
  SceneJS.createNode(BlenderExport.BallistaTower);
  this.towers = new Array(sqrGridSize * levels);
  for (c = 0; (0 <= sqrGridSize * levels ? c < sqrGridSize * levels : c > sqrGridSize * levels); (0 <= sqrGridSize * levels ? c += 1 : c -= 1)) {
    this.towers[c] = -1;
  }
  this.targets = new Array(sqrGridSize * levels);
  for (c = 0; (0 <= sqrGridSize * levels ? c < sqrGridSize * levels : c > sqrGridSize * levels); (0 <= sqrGridSize * levels ? c += 1 : c -= 1)) {
    this.targets[c] = null;
  }
  this.towers[levelGoals[0]] = -2;
  this.towers[levelGoals[1]] = -2;
  this.towers[levelGoals[2]] = -2;
  return this;
};
Towers.prototype.update = function() {
  var _result, c;
  _result = [];
  for (c = 0; (0 <= sqrGridSize * levels ? c < sqrGridSize * levels : c > sqrGridSize * levels); (0 <= sqrGridSize * levels ? c += 1 : c -= 1)) {
    _result.push(this.targets[c] = null);
  }
  return _result;
};
Towers.prototype.present = function(creature) {
  var gridPos;
  return (gridPos = positionToGrid(creature.pos[0], creature.pos[1]));
};
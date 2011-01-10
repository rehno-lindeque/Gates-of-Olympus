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
  this.delays = new Array(sqrGridSize * levels);
  for (c = 0; (0 <= sqrGridSize * levels ? c < sqrGridSize * levels : c > sqrGridSize * levels); (0 <= sqrGridSize * levels ? c += 1 : c -= 1)) {
    this.delays[c] = 0.0;
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
  var _ref, _ref2, _ref3, _ref4, _result, _result2, cx, cy, gridPos, index;
  gridPos = positionToGrid(creature.pos[0], creature.pos[1]);
  _result = []; _ref = max(gridPos[1] - 1, 0); _ref2 = min(gridPos[1] + 1, gridSize - 1);
  for (cy = _ref; (_ref <= _ref2 ? cy <= _ref2 : cy >= _ref2); (_ref <= _ref2 ? cy += 1 : cy -= 1)) {
    _result.push((function() {
      _result2 = []; _ref3 = max(gridPos[0] - 1, 0); _ref4 = min(gridPos[0] + 1, gridSize - 1);
      for (cx = _ref3; (_ref3 <= _ref4 ? cx <= _ref4 : cx >= _ref4); (_ref3 <= _ref4 ? cx += 1 : cx -= 1)) {
        _result2.push((function() {
          index = creature.level * sqrGridSize + cy * gridSize + cx;
          return this.targets[index] === null && (this.towers[index] >= 0) ? (this.targets[index] = creature) : null;
        }).call(this));
      }
      return _result2;
    }).call(this));
  }
  return _result;
};
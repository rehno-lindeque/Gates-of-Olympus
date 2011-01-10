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
  var c, clevel, cx, cy, origin, platformCenters;
  platformCenters = [gridToPosition(gridSize / 2, gridSize / 2, 0), gridToPosition(gridSize / 2, gridSize / 2, 1), gridToPosition(gridSize / 2, gridSize / 2, 2)];
  for (clevel = 0; (0 <= levels ? clevel < levels : clevel > levels); (0 <= levels ? clevel += 1 : clevel -= 1)) {
    for (cy = 0; (0 <= gridSize ? cy < gridSize : cy > gridSize); (0 <= gridSize ? cy += 1 : cy -= 1)) {
      for (cx = 0; (0 <= gridSize ? cx < gridSize : cx > gridSize); (0 <= gridSize ? cx += 1 : cx -= 1)) {
        c = clevel * sqrGridSize + cy * gridSize + cx;
        if (this.delays[c] > 0.0) {
          this.delays[c] -= 1.0;
        }
        if (this.targets[c] !== null && (this.delays[c] <= 0.0) && this.targets[c].health > 0) {
          origin = gridToPosition(cx, cy, clevel);
          level.projectiles[clevel][0].add(subVec3(origin, platformCenters[clevel]), subVec3(this.targets[c].pos, origin));
          this.targets[c].damage(10);
          this.delays[c] = 50.0;
        }
        this.targets[c] = null;
      }
    }
  }
  return null;
};
Towers.prototype.present = function(creature) {
  var _ref, _ref2, _ref3, _ref4, cx, cy, gridPos, index;
  gridPos = positionToGrid(creature.pos[0], creature.pos[1]);
  _ref = max(gridPos[1] - 1, 0); _ref2 = min(gridPos[1] + 1, gridSize - 1);
  for (cy = _ref; (_ref <= _ref2 ? cy <= _ref2 : cy >= _ref2); (_ref <= _ref2 ? cy += 1 : cy -= 1)) {
    _ref3 = max(gridPos[0] - 1, 0); _ref4 = min(gridPos[0] + 1, gridSize - 1);
    for (cx = _ref3; (_ref3 <= _ref4 ? cx <= _ref4 : cx >= _ref4); (_ref3 <= _ref4 ? cx += 1 : cx -= 1)) {
      index = creature.level * sqrGridSize + cy * gridSize + cx;
      if (this.targets[index] === null && (this.towers[index] >= 0)) {
        this.targets[index] = creature;
      }
    }
  }
  return null;
};
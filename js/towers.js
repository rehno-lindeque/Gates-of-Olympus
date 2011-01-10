var Tower, Towers, archerRadiusSQR, archerTowerUpdate, catapultTowerUpdate;
/*
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Tower types
*/
archerRadiusSQR = 1.0;
archerTowerUpdate = function(index) {};
/*
towerX = index % gridSize
towerY = index / gridSize
towerLevel = index / sqrGridSize
towerPos = indexToPosition(towerX, towerY, towerLevel)
for c in level.creatures.creatures
  distX = c.pos[0] - towerPos.x
  distY = c.pos[1] - towerPos.y
distSQR = distX*distX + distY*distY
  if (distSQR < archerRadiusSQR)

  */
catapultTowerUpdate = function(index) {};
/*
Tower class
*/
Tower = function() {};
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
  var c, cgrid, clevel;
  for (clevel = 0; (0 <= levels ? clevel < levels : clevel > levels); (0 <= levels ? clevel += 1 : clevel -= 1)) {
    for (cgrid = 0; (0 <= sqrGridSize ? cgrid < sqrGridSize : cgrid > sqrGridSize); (0 <= sqrGridSize ? cgrid += 1 : cgrid -= 1)) {
      c = cgrid + clevel * sqrGridSize;
      if (this.delays[c] > 0.0) {
        this.delays[c] -= 1.0;
      }
      if (this.targets[c] !== null && (this.delays[c] <= 0.0)) {
        level.projectiles[clevel][0].add([0.1, 0.1, 0.1], [0.1, 1.0, 0.1]);
        this.targets[c].damage(10);
        this.delays[c] = 50.0;
      }
      this.targets[c] = null;
    }
  }
  return null;
};
Towers.prototype.present = function(creature) {
  var _a, _b, _c, _d, cx, cy, gridPos, index;
  gridPos = positionToGrid(creature.pos[0], creature.pos[1]);
  _a = max(gridPos[1] - 1, 0); _b = min(gridPos[1] + 1, gridSize - 1);
  for (cy = _a; (_a <= _b ? cy <= _b : cy >= _b); (_a <= _b ? cy += 1 : cy -= 1)) {
    _c = max(gridPos[0] - 1, 0); _d = min(gridPos[0] + 1, gridSize - 1);
    for (cx = _c; (_c <= _d ? cx <= _d : cx >= _d); (_c <= _d ? cx += 1 : cx -= 1)) {
      index = creature.level * sqrGridSize + cy * gridSize + cx;
      if (this.targets[index] === null && (this.towers[index] >= 0)) {
        this.targets[index] = creature;
      }
    }
  }
  return null;
};
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
  var _a, c;
  SceneJS.createNode(BlenderExport.ArcherTower);
  SceneJS.createNode(BlenderExport.CatapultTower);
  SceneJS.createNode(BlenderExport.BallistaTower);
  this.towers = new Array(sqrGridSize * levels);
  _a = (sqrGridSize * levels);
  for (c = 0; (0 <= _a ? c < _a : c > _a); (0 <= _a ? c += 1 : c -= 1)) {
    this.towers[c] = -1;
  }
  this.towers[levelGoals[0]] = -2;
  this.towers[levelGoals[1]] = -2;
  this.towers[levelGoals[2]] = -2;
  return this;
};
Towers.prototype.update = function() {};
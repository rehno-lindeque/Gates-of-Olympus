var canvasSize, cellScale, clamp, gridSize, guiDiasRotPosition, guiDiasRotVelocity, lerp, levels, max, min, numTowerTypes, platformHeights, platformLengths, sqrGridSize, square, towerPlacement;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Auxiliary functions
*/
square = function(x) {
  return x * x;
};
min = function(x, y) {
  return x < y ? x : y;
};
max = function(x, y) {
  return x > y ? x : y;
};
clamp = function(x, y, z) {
  return (x < y) ? y : (x > z ? z : x);
};
lerp = function(t, x, y) {
  return x * (1.0 - t) + y * t;
};
/*
Globals
*/
canvasSize = [1020.0, 800.0];
gridSize = 12;
sqrGridSize = square(gridSize);
levels = 3;
cellScale = 0.9;
platformHeights = [cellScale * 10 + 1.15, 1.15, cellScale * -11 + 1.15];
platformLengths = [0.78 * 0.5 * cellScale * gridSize, 1.00 * 0.5 * cellScale * gridSize, 1.22 * 0.5 * cellScale * gridSize];
numTowerTypes = 3;
guiDiasRotVelocity = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
guiDiasRotPosition = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
towerPlacement = {
  level: -1,
  cell: {
    x: -1,
    y: -1
  }
};
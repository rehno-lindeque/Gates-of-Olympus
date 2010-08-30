var canvasSize, cellScale, clamp, gameSceneOffset, gridHalfSize, gridSize, guiDiasRotPosition, guiDiasRotVelocity, key0, key1, key2, key3, key4, key5, key6, key7, key8, key9, keyESC, lerp, levels, max, min, mouseSpeed, numTowerTypes, platformHeights, platformLengths, platformScales, sqrGridSize, square, towerPlacement;
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
keyESC = 27;
key0 = 48 + 0;
key1 = 48 + 1;
key2 = 48 + 2;
key3 = 48 + 3;
key4 = 48 + 4;
key5 = 48 + 5;
key6 = 48 + 6;
key7 = 48 + 7;
key8 = 48 + 8;
key9 = 48 + 9;
mouseSpeed = 0.005;
canvasSize = [1020.0, 800.0];
gameSceneOffset = [3.0, 0.0, 0.0];
gridSize = 12;
gridHalfSize = gridSize / 2;
sqrGridSize = square(gridSize);
levels = 3;
cellScale = 0.9;
platformHeights = [cellScale * 10 + 1.15, 1.15, cellScale * -11 + 1.15];
platformScales = [0.78, 1.00, 1.22];
platformLengths = [platformScales[0] * 0.5 * cellScale * gridSize, platformScales[1] * 0.5 * cellScale * gridSize, platformScales[2] * 0.5 * cellScale * gridSize];
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
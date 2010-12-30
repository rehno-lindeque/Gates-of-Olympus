var canvasSize, cellScale, clamp, gameSceneOffset, gridHalfSize, gridSize, guiDaisRotPosition, guiDaisRotVelocity, idealAspectRatio, key0, key1, key2, key3, key4, key5, key6, key7, key8, key9, keyESC, lerp, levels, max, min, mouseSpeed, platformHeightOffset, platformHeights, platformScaleFactor, platformScaleHeights, platformScaleLengths, platformScales, sqrGridSize, square, towerPlacement;
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
canvasSize = [window.innerWidth, window.innerHeight];
idealAspectRatio = 1020.0 / 800.0;
gameSceneOffset = [3.0, 0.0, 0.0];
gridSize = 12;
gridHalfSize = gridSize / 2;
sqrGridSize = square(gridSize);
levels = 3;
cellScale = 0.9;
platformHeightOffset = 1.75;
platformHeights = [platformHeightOffset + cellScale * 12, platformHeightOffset, platformHeightOffset - cellScale * 10];
platformScaleFactor = 0.02;
platformScales = [1.0 / (1.0 + platformScaleFactor * platformHeights[0]), 1.0 / (1.0 + platformScaleFactor * platformHeights[1]), 1.0 / (1.0 + platformScaleFactor * platformHeights[2])];
platformScaleHeights = [platformHeights[0] * platformScales[0], platformHeights[1] * platformScales[1], platformHeights[2] * platformScales[2]];
platformScaleLengths = [platformScales[0] * 0.5 * cellScale * gridSize, platformScales[1] * 0.5 * cellScale * gridSize, platformScales[2] * 0.5 * cellScale * gridSize];
guiDaisRotVelocity = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
guiDaisRotPosition = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
towerPlacement = {
  level: -1,
  cell: {
    x: -1,
    y: -1
  }
};
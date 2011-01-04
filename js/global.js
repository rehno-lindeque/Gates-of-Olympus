var canvasSize, cellScale, clamp, gameSceneOffset, gridHalfSize, gridSize, guiDaisRotPosition, guiDaisRotVelocity, idealAspectRatio, indexToPosition, initializeLevelGoals, key0, key1, key2, key3, key4, key5, key6, key7, key8, key9, keyESC, lerp, levelGoals, levels, max, min, mouseSpeed, numTowerTypes, platformHeightOffset, platformHeights, platformScaleFactor, platformScaleHeights, platformScaleLengths, platformScales, positionToIndex, sqrGridSize, square, towerPlacement;
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
positionToIndex = function(x, y, level) {
  var curPosX, curPosY, index;
  curPosX = Math.floor((x / cellScale) + gridSize / 2);
  curPosY = Math.floor((y / cellScale) + gridSize / 2);
  index = curPosX + gridSize * curPosY + sqrGridSize * level;
  return index;
};
indexToPosition = function(x, y, level) {
  var pos, posX, posY;
  y = y % gridSize;
  posX = cellScale * (x - gridSize / 2) + cellScale * 0.5;
  posY = cellScale * (y - gridSize / 2) + cellScale * 0.5;
  pos = {
    x: posX,
    y: posY
  };
  return pos;
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
numTowerTypes = 3;
guiDaisRotVelocity = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
guiDaisRotPosition = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
towerPlacement = {
  level: -1,
  cell: {
    x: -1,
    y: -1
  }
};
levelGoals = new Array(levels);
initializeLevelGoals = function() {
  levelGoals[0] = 0 + 0 * gridSize;
  levelGoals[1] = 6 + 6 * gridSize + sqrGridSize;
  return (levelGoals[2] = 0 + 0 * gridSize + 2 * sqrGridSize);
};
initializeLevelGoals();
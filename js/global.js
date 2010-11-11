var canvasSize, cellScale, clamp, edgeCost, floodFill, floodFillDebug, floodFillGenPath, floodInit, floyd, floydInit, gameSceneOffset, getPath, grid, gridHalfSize, gridSize, guiDaisRotPosition, guiDaisRotVelocity, i, idealAspectRatio, key0, key1, key2, key3, key4, key5, key6, key7, key8, key9, keyESC, lerp, levels, max, min, mouseSpeed, next, numTowerTypes, path, platformHeightOffset, platformHeights, platformScaleFactor, platformScaleHeights, platformScaleLengths, platformScales, sqrGridSize, square, towerPlacement;
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
Pathfinding - Floyd warshall for now, might be slow
*/
edgeCost = function(i, j) {
  if (i === j) {
    return 0;
  }
  if (level.towers.towers[i] !== -1 || level.towers.towers[j] !== -1) {
    return Infinity;
  }
  if (j === i - 1 || j === i + 1 || j === i - gridSize || j === i + gridSize) {
    return 1;
  }
  if (j === i - gridSize - 1 || j === i - gridSize + 1 || j === i + gridSize - 1 || j === i + gridSize + 1) {
    return 2;
  }
  return Infinity;
};
floydInit = function() {
  var _a, _b, i, j;
  _a = [];
  for (i = 0; (0 <= sqrGridSize - 1 ? i <= sqrGridSize - 1 : i >= sqrGridSize - 1); (0 <= sqrGridSize - 1 ? i += 1 : i -= 1)) {
    _a.push((function() {
      _b = [];
      for (j = 0; (0 <= sqrGridSize - 1 ? j <= sqrGridSize - 1 : j >= sqrGridSize - 1); (0 <= sqrGridSize - 1 ? j += 1 : j -= 1)) {
        _b.push((function() {
          path[i][j] = edgeCost(i, j);
          return (next[i][j] = null);
        })());
      }
      return _b;
    })());
  }
  return _a;
};
floyd = function() {
  var _a, _b, i, j, k;
  _a = [];
  for (k = 0; (0 <= sqrGridSize - 1 ? k <= sqrGridSize - 1 : k >= sqrGridSize - 1); (0 <= sqrGridSize - 1 ? k += 1 : k -= 1)) {
    _a.push((function() {
      _b = [];
      for (i = 0; (0 <= sqrGridSize - 1 ? i <= sqrGridSize - 1 : i >= sqrGridSize - 1); (0 <= sqrGridSize - 1 ? i += 1 : i -= 1)) {
        _b.push((function() {
          for (j = 0; (0 <= sqrGridSize - 1 ? j <= sqrGridSize - 1 : j >= sqrGridSize - 1); (0 <= sqrGridSize - 1 ? j += 1 : j -= 1)) {
            if (path[i][k] + path[k][j] < path[i][j]) {
              path[i][j] = path[i][k] + path[k][j];
            }
          }
          return (next[i][j] = k);
        })());
      }
      return _b;
    })());
  }
  return _a;
};
getPath = function(i, j) {
  var intermediate;
  if (path[i][j] === Infinity) {
    return null;
  }
  intermediate = next[i][j];
  if (typeof intermediate !== "undefined" && intermediate !== null) {
    return getPath(i(intermediate + intermediate + getPath(intermediate(j))));
  }
  return null;
};
floodInit = function() {
  var _a, i;
  _a = [];
  for (i = 0; (0 <= sqrGridSize - 1 ? i <= sqrGridSize - 1 : i >= sqrGridSize - 1); (0 <= sqrGridSize - 1 ? i += 1 : i -= 1)) {
    _a.push(grid[i] = 0);
  }
  return _a;
};
floodFill = function(goal) {
  var Q, _a, _b, _c, f, i, index, j, l, pos, x, y;
  Q = new Array();
  f = 0;
  l = 1;
  Q[f] = goal;
  _a = [];
  while ((f <= l)) {
    _a.push((function() {
      pos = Q[f];
      f++;
      _b = [];
      for (i = -1; i <= 1; i++) {
        _b.push((function() {
          _c = [];
          for (j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
              _c.push((function() {
                x = Math.floor(pos % gridSize) + j;
                y = Math.floor(pos / gridSize) + i;
                if ((x >= 0) && x < gridSize && (y >= 0) && y < gridSize) {
                  index = (x) + (y) * gridSize;
                  if (level.towers.towers[index] === -1) {
                    if (grid[index] === 0 && index !== goal) {
                      grid[index] = grid[pos] + Math.abs(i) + Math.abs(j);
                      Q[l] = index;
                      return l++;
                    }
                  }
                }
              })());
            }
          }
          return _c;
        })());
      }
      return _b;
    })());
  }
  return _a;
};
floodFillDebug = function() {
  var _a, i, j;
  _a = [];
  for (i = 0; (0 <= gridSize - 1 ? i <= gridSize - 1 : i >= gridSize - 1); (0 <= gridSize - 1 ? i += 1 : i -= 1)) {
    _a.push((function() {
      for (j = 0; (0 <= gridSize - 1 ? j <= gridSize - 1 : j >= gridSize - 1); (0 <= gridSize - 1 ? j += 1 : j -= 1)) {
        document.write(grid[i * gridSize + j]);
      }
      return document.writeln();
    })());
  }
  return _a;
};
floodFillGenPath = function(start, goal) {
  var _a, cur, i, index, j, shortest, shortestIndex, x, y;
  cur = start;
  shortest = Infinity;
  shortestIndex = -1;
  _a = [];
  while ((cur !== goal)) {
    _a.push((function() {
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          if (i !== 0 || j !== 0) {
            x = Math.floor(cur % gridSize) + j;
            y = Math.floor(cur / gridSize) + i;
            if ((x >= 0) && x < gridSize && (y >= 0) && y < gridSize) {
              index = (x) + (y) * gridSize;
              if (level.towers.towers[index] === -1) {
                if (grid[index] < shortest) {
                  shortest = grid[index];
                  shortestIndex = index;
                }
              }
            }
          }
        }
      }
      next[shortestIndex][cur] = cur;
      cur = shortestIndex;
      shortest = Infinity;
      return (shortestIndex = -1);
    })());
  }
  return _a;
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
path = new Array(sqrGridSize);
next = new Array(sqrGridSize);
grid = new Array(sqrGridSize);
for (i = 0; (0 <= sqrGridSize - 1 ? i <= sqrGridSize - 1 : i >= sqrGridSize - 1); (0 <= sqrGridSize - 1 ? i += 1 : i -= 1)) {
  path[i] = new Array(sqrGridSize);
  next[i] = new Array(sqrGridSize);
}
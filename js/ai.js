var dirtyLevel, floodFill, floodFillGenPath, floodInit, getMove, grid, i, next, towerIsBlocking, updateAI;
/*
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
grid = new Array(sqrGridSize * levels);
next = new Array(sqrGridSize * levels);
dirtyLevel = new Array(levels);
dirtyLevel[0] = true;
dirtyLevel[1] = true;
dirtyLevel[2] = true;
for (i = 0; (0 <= sqrGridSize * levels - 1 ? i <= sqrGridSize * levels - 1 : i >= sqrGridSize * levels - 1); (0 <= sqrGridSize * levels - 1 ? i += 1 : i -= 1)) {
  next[i] = new Array(sqrGridSize);
}
/*
Pathfinding - Floyd warshall
*/
/* - not currently in use, might use later (probably not)
edgeCost = (i,j) ->
  if i==j
    return 0
  if level.towers.towers[i] != -1 or level.towers.towers[j] != -1
    return Infinity
  # left, right, top, bottom
  if (j==i-1 or j==i+1 or j==i-gridSize or j==i+gridSize)
    return 1
  # diagonals
  if (j==i-gridSize-1 or j==i-gridSize+1 or j==i+gridSize-1 or j==i+gridSize+1)
    return 2 # 1^2 + 1^2
  return Infinity

floydInit = ->
  for i in [0..sqrGridSize-1]
    for j in [0..sqrGridSize-1]
      path[i][j] = edgeCost(i,j)
      next[i][j] = null


floyd = ->
  for k in [0..sqrGridSize-1]
    for i in [0..sqrGridSize-1]
      for j in [0..sqrGridSize-1]
        if path[i][k] + path[k][j] < path[i][j]
          path[i][j] = path[i][k] + path[k][j]
	      next[i][j] = k

getPath = (i, j) ->
  if path[i][j] is Infinity
    return null
  intermediate = next[i][j]
  if intermediate?
    return getPath i intermediate + intermediate + getPath intermediate j
  return null

*/
/*
flood fill pathfinding
*/
floodInit = function() {
  var _result, i;
  _result = [];
  for (i = 0; (0 <= sqrGridSize * 3 - 1 ? i <= sqrGridSize * 3 - 1 : i >= sqrGridSize * 3 - 1); (0 <= sqrGridSize * 3 - 1 ? i += 1 : i -= 1)) {
    _result.push(grid[i] = 0);
  }
  return _result;
};
floodFill = function(goal, lev) {
  var Q, _result, _result2, _result3, f, i, index, j, l, pos, shortestThroughNode, x, y;
  Q = new Array();
  f = 0;
  l = 1;
  Q[f] = goal;
  _result = [];
  while ((f <= l)) {
    _result.push((function() {
      pos = Q[f];
      f++;
      _result2 = [];
      for (i = -1; i <= 1; i++) {
        _result2.push((function() {
          _result3 = [];
          for (j = -1; j <= 1; j++) {
            if (Math.abs(i + j) === 1) {
              _result3.push((function() {
                x = Math.floor(pos % gridSize) + j;
                y = Math.floor(pos / gridSize) + i;
                if ((x >= 0) && x < gridSize && (y >= (gridSize * lev)) && y < (gridSize * (lev + 1))) {
                  index = (x) + (y) * gridSize;
                  if (index !== goal) {
                    if (level.towers.towers[index] >= 0) {
                      return (grid[index] = Infinity);
                    } else {
                      shortestThroughNode = grid[pos] + Math.abs(i) + Math.abs(j);
                      if (shortestThroughNode < grid[index] || grid[index] === 0) {
                        if (grid[index] === 0) {
                          Q[l] = index;
                          l++;
                        }
                        return (grid[index] = shortestThroughNode);
                      }
                    }
                  }
                }
              })());
            }
          }
          return _result3;
        })());
      }
      return _result2;
    })());
  }
  return _result;
};
floodFillGenPath = function(start, lev) {
  var _result, cur, goal, i, index, j, shortest, shortestIndex, x, y;
  cur = start;
  goal = levelGoals[lev];
  shortest = Infinity;
  shortestIndex = -1;
  _result = [];
  while ((cur !== goal)) {
    _result.push((function() {
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          if (i !== 0 || j !== 0) {
            x = Math.floor(cur % gridSize) + j;
            y = Math.floor(cur / gridSize) + i;
            if ((x >= 0) && x < gridSize && (y >= (gridSize * lev)) && y < (gridSize * (lev + 1))) {
              index = (x) + (y) * gridSize;
              if (grid[index] < shortest && level.towers.towers[index] < 0) {
                if (!(Math.abs(i + j) !== 1 && ((level.towers.towers[index - j] >= 0) || (level.towers.towers[index - i * gridSize] >= 0)))) {
                  shortest = grid[index];
                  shortestIndex = index;
                }
              }
            }
          }
        }
      }
      next[cur][goal] = shortestIndex;
      cur = shortestIndex;
      shortest = Infinity;
      return (shortestIndex = -1);
    })());
  }
  return _result;
};
getMove = function(x, y, lev) {
  var index, len, nextCell, nextCellX, nextCellY, nextPos, vel, velX, velY;
  index = positionToIndex(x, y, lev);
  nextCell = next[index][levelGoals[lev]];
  nextCellX = Math.floor(nextCell % gridSize);
  nextCellY = Math.floor(nextCell / gridSize);
  nextPos = indexToPosition(nextCellX, nextCellY, lev);
  velX = nextPos.x - x;
  velY = nextPos.y - y;
  len = Math.sqrt(velX * velX + velY * velY);
  vel = {
    x: velX / len,
    y: velY / len
  };
  return vel;
};
updateAI = function() {
  var _i, _len, _ref, _result, creature, i, index, lev;
  floodInit();
  floodFill(levelGoals[0], 0);
  floodFill(levelGoals[1], 1);
  floodFill(levelGoals[2], 2);
  _ref = level.creatures.creatures;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    creature = _ref[_i];
    lev = creature.level;
    index = creature.getGridIndex();
    if (creature.state === 1) {
      floodFillGenPath(index, lev);
    }
  }
  _result = [];
  for (i = 0; i <= 2; i++) {
    _result.push(dirtyLevel[i] = false);
  }
  return _result;
};
towerIsBlocking = function(index) {
  var _i, _len, _ref, c, startIndex, towerLevel;
  if (level.towers.towers[index] !== -1) {
    return true;
  }
  level.towers.towers[index] = 0;
  towerLevel = Math.floor(index / sqrGridSize);
  floodInit();
  floodFill(levelGoals[towerLevel], towerLevel);
  level.towers.towers[index] = -1;
  startIndex = new Array(3);
  startIndex[0] = positionToIndex(0, 0, 0);
  startIndex[1] = levelGoals[0] + sqrGridSize;
  startIndex[2] = levelGoals[1] + sqrGridSize;
  if (grid[startIndex[towerLevel]] === 0) {
    return true;
  }
  _ref = level.creatures.creatures;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    c = _ref[_i];
    if (c.level === towerLevel && grid[c.gridIndex] === 0) {
      return true;
    }
  }
  return false;
};
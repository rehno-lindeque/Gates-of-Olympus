###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Auxiliary functions
###

square = (x) -> x*x
min = (x, y) -> if x < y then x else y
max = (x, y) -> if x > y then x else y
clamp = (x, y, z) -> if (x < y) then y else (if x > z then z else x)
lerp = (t, x, y) -> x * (1.0 - t) + y * t

###
Pathfinding - Floyd warshall for now, might be slow
###

# dist squared is metric
# oh thats right, i'm using the square of infinity baby
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

  # flood for now, maybe do hadlock
floodInit = ->
  for i in [0..sqrGridSize-1]
    #for j in [0..gridSize-1]
    grid[i] = 0
  
floodFill = (goal) ->
  Q = new Array()
  f = 0
  l = 1
  Q[f] = goal
  #Q[l] = sqrGridSize-1
  while (f<=l)
    pos = Q[f]
    f++
    for i in [-1..1]
      for j in [-1..1] when (i!= 0 || j!=0)
        x = Math.floor(pos % gridSize) + j
        y = Math.floor(pos / gridSize) + i
        if (x>=0 && x < gridSize && y>=0 && y < gridSize)
          index = (x) + (y)*gridSize
          if (level.towers.towers[index] == -1)
            if (grid[index] == 0 && index != goal)
              grid[index] = grid[pos] + Math.abs(i) + Math.abs(j)
              Q[l] = index
              l++
	
  # end while f<=l
  # now step back from goal and find path
  
floodFillDebug = ->
  for i in [0..gridSize-1]
    for j in [0..gridSize-1]
      document.write(grid[i*gridSize+j])
    document.writeln()
      

# backtracks from goal to start
floodFillGenPath = (start,goal) ->
  cur = start
  shortest = Infinity
  shortestIndex = -1
  while (cur != goal)
    for i in [-1..1]
      for j in [-1..1] when (i!= 0 || j!=0)
        x = Math.floor(cur % gridSize) + j
        y = Math.floor(cur / gridSize) + i
        if (x>=0 && x < gridSize && y>=0 && y < gridSize)
          index = (x) + (y)*gridSize
          if (level.towers.towers[index] == -1)
            if (grid[index] < shortest) 
              shortest = grid[index]
              shortestIndex = index
    next[shortestIndex][cur] = cur
    cur = shortestIndex
    shortest = Infinity
    shortestIndex = -1
  

###
Globals
###

# Keyboard codes
keyESC = 27
key0   = 48+0
key1   = 48+1
key2   = 48+2
key3   = 48+3
key4   = 48+4
key5   = 48+5
key6   = 48+6
key7   = 48+7
key8   = 48+8
key9   = 48+9

# Mouse inputs
mouseSpeed = 0.005

# Canvas
canvasSize = [window.innerWidth, window.innerHeight]
idealAspectRatio = 1020.0 / 800.0
gameSceneOffset = [3.0, 0.0, 0.0]

# Platforms
gridSize = 12                   # number of grid cells in one row or column
gridHalfSize = gridSize/2       # half the number of cells in one row or column
sqrGridSize = square(gridSize)  # total number of grid cells
levels = 3                      # number of platforms
cellScale = 0.9                 # size of a grid cell in world space

platformHeightOffset = 1.75
platformHeights = [
  platformHeightOffset + cellScale*12
  platformHeightOffset
  platformHeightOffset - cellScale*10
]

platformScaleFactor = 0.02

platformScales = [
  1.0/(1.0 + platformScaleFactor * platformHeights[0])
  1.0/(1.0 + platformScaleFactor * platformHeights[1])
  1.0/(1.0 + platformScaleFactor * platformHeights[2])
]

platformScaleHeights = [
  platformHeights[0] * platformScales[0]
  platformHeights[1] * platformScales[1]
  platformHeights[2] * platformScales[2]
]
  
platformScaleLengths = [
  platformScales[0] * 0.5 * cellScale * gridSize
  platformScales[1] * 0.5 * cellScale * gridSize
  platformScales[2] * 0.5 * cellScale * gridSize 
]

# Towers
numTowerTypes = 3

# State
guiDaisRotVelocity = [
  0.0, 0.0
  0.0, 0.0
  0.0, 0.0 ]

guiDaisRotPosition = [
  0.0, 0.0
  0.0, 0.0
  0.0, 0.0 ]
  
# Input
towerPlacement = 
  level: -1
  cell: { x: -1, y: -1 }

# Pathfinding
path = new Array (sqrGridSize)
next = new Array (sqrGridSize)
grid = new Array (sqrGridSize)

for i in [0..sqrGridSize-1]
  path[i] = new Array (sqrGridSize)
  next[i] = new Array (sqrGridSize)



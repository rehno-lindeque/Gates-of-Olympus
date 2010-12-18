###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

# Pathfinding

grid = new Array (sqrGridSize*levels)

#path = new Array (sqrGridSize*levels)
next = new Array (sqrGridSize*levels)

dirtyLevel = new Array (levels)

dirtyLevel[0] = true
dirtyLevel[1] = true
dirtyLevel[2] = true

levelGoals = new Array (levels)

levelGoals[0] = 6 + 11*gridSize
levelGoals[1] = 6 + 11*gridSize + sqrGridSize
levelGoals[2] = 6 + 11*gridSize + 2*sqrGridSize

for i in [0..sqrGridSize*levels -1]
  #path[i] = new Array (sqrGridSize)
  next[i] = new Array (sqrGridSize)


###
Pathfinding - Floyd warshall for now, might be slow
###

###
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
  
###

  
positionToIndex = (x,y) ->
  curPosX = Math.floor((x/cellScale) + gridSize/2)
  curPosY = Math.floor((y/cellScale) + gridSize/2)
  index = curPosX + gridSize*curPosY
  return index
  
indexToPosition = (x,y) -> # x y as indices
  posX = cellScale * (x - gridSize / 2) + cellScale * 0.5 
  posY = cellScale * (y - gridSize / 2) + cellScale * 0.5 
  pos = { x: posX, y: posY}
  return pos


  # flood for now
floodInit = ->
  for i in [0..sqrGridSize-1]
    #for j in [0..gridSize-1]
    grid[i] = 0
  
floodFill = (goal,lev) ->
  Q = new Array()
  f = 0
  l = 1
  Q[f] = goal
  #Q[l] = sqrGridSize-1
  while (f<=l)
    pos = Q[f]
    f++
    for i in [-1..1]
      for j in [-1..1] when (Math.abs(i+j) == 1) #(i!= 0 || j!=0)
        x = Math.floor(pos % gridSize) + j
        y = Math.floor(pos / gridSize) + i
        if (x>=0 && x < gridSize && y>=(gridSize*lev) && y < (gridSize*(lev+1)))
          index = (x) + (y)*gridSize #level*sqrGridSize
          if (index != goal) #grid[index] == 0 &&  this might not work in all situations, so lets see
            if (level.towers.towers[index] != -1) 
              grid[index] = Infinity
            else
              shortestThroughNode = grid[pos] + Math.abs(i) + Math.abs(j)         #might not be necessary
              if (shortestThroughNode < grid[index] || grid[index] == 0)
                if (grid[index] == 0)
                  Q[l] = index
                  l++
                grid[index] = shortestThroughNode
               
	
  # end while f<=l
  # now step back from goal and find path

# backtracks from goal to start
floodFillGenPath = (start,goal,lev) ->
  cur = start
  shortest = Infinity
  shortestIndex = -1
  while (cur != goal)
    for i in [-1..1]
      for j in [-1..1] when (i!= 0 || j!=0)
        x = Math.floor(cur % gridSize) + j
        y = Math.floor(cur / gridSize) + i
        if (x>=0 && x < gridSize && y>=(gridSize*lev) && y < (gridSize*(lev+1)))
          index = (x) + (y)*gridSize
          if (grid[index] < shortest && level.towers.towers[index] == -1) 
            if ((Math.abs(i+j) != 1 && (level.towers.towers[index-j] != -1 || level.towers.towers[index-i*gridSize] != -1))) # corner
              wow = true
            else 
              shortest = grid[index]
              shortestIndex = index
    next[cur][goal] = shortestIndex
    cur = shortestIndex
    shortest = Infinity
    shortestIndex = -1
  
towerPlacement = 
  level: -1
  cell: { x: -1, y: -1 }

getMove = (x,y,lev) ->
  index = positionToIndex(x,y)
    
  nextCell = next[index][levelGoals[lev]]
  nextCellX = Math.floor(nextCell % gridSize)
  nextCellY = Math.floor(nextCell / gridSize)
  
  nextPos = indexToPosition(nextCellX,nextCellY)
  velX = nextPos.x - x
  velY = nextPos.y - y
  if (velX == 0 && velY ==0)
    gotcha=1
    len = 1
  else
    len = Math.sqrt(velX*velX + velY*velY)
  vel = { x: velX/len, y: velY/len}
  return vel
  
# notes -> to check block, simply see if the floodfill visits all squares, hold counter
updateAI = ->
  for i in [0..2]
    if (dirtyLevel[i])
      floodFill(levelGoals[i],i)
      
  # work out paths for creeps on level i
  for creature in level.creatures.creatures
    lev = creature.level
    index = creature.index
    # for now this is not gonna be as efficient as I would like, basically 
    # regenerate each path for each creep on a node. this should be shared
    if (dirtyLevel[lev])
      floodFillGenPath(index,levelGoals[lev],lev)
        
  # everything ready
  for i in [0..2]
    dirtyLevel[i] = false
      
      
  
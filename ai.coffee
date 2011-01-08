###
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

# Pathfinding


#pathfinding specific globals
grid = new Array (sqrGridSize*levels)

next = new Array (sqrGridSize*levels)

dirtyLevel = new Array (levels)

dirtyLevel[0] = true
dirtyLevel[1] = true
dirtyLevel[2] = true
 
for i in [0..sqrGridSize*levels -1]
  #path[i] = new Array (sqrGridSize)
  next[i] = new Array (sqrGridSize)

###
Pathfinding - Floyd warshall
###

### - not currently in use, might use later (probably not)
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

###
flood fill pathfinding
###

floodInit = ->
  for i in [0..sqrGridSize*3-1]
    grid[i] = 0

# basic flood fill for now, should be fine 
floodFill = (goal,lev) ->
  Q = new Array()
  f = 0
  l = 1
  Q[f] = goal
  while (f<=l)
    pos = Q[f]
    f++
    for i in [-1..1]
      for j in [-1..1] when (Math.abs(i+j) == 1) 
        x = Math.floor(pos % gridSize) + j
        y = Math.floor(pos / gridSize) + i
        if (x>=0 && x < gridSize && y>=(gridSize*lev) && y < (gridSize*(lev+1)))
          index = (x) + (y)*gridSize 
          if (index != goal) 
            if (level.towers.towers[index] >= 0) 
              grid[index] = Infinity
            else
              shortestThroughNode = grid[pos] + Math.abs(i) + Math.abs(j)         # + 1
              if (shortestThroughNode < grid[index] || grid[index] == 0)
                if (grid[index] == 0)
                  Q[l] = index
                  l++
                grid[index] = shortestThroughNode
               
	
  # end while f<=l
  # now step back from goal and find path

# backtracks from goal to start
floodFillGenPath = (start,lev) ->
  cur = start
  goal = levelGoals[lev]
  shortest = Infinity
  shortestIndex = -1
  while (cur != goal)
    for i in [-1..1]
      for j in [-1..1] when (i!= 0 || j!=0)
        x = Math.floor(cur % gridSize) + j
        y = Math.floor(cur / gridSize) + i
        if (x>=0 && x < gridSize && y>=(gridSize*lev) && y < (gridSize*(lev+1)))
          index = (x) + (y)*gridSize
          if (grid[index] < shortest && level.towers.towers[index] < 0) 
            if (!((Math.abs(i+j) != 1 && (level.towers.towers[index-j] >=0 || level.towers.towers[index-i*gridSize] >= 0)))) # corner
              shortest = grid[index]
              shortestIndex = index
    next[cur][goal] = shortestIndex
    cur = shortestIndex
    #reset
    shortest = Infinity
    shortestIndex = -1
 
getMove = (x,y,lev) ->
  index = positionToIndex(x,y,lev)
    
  nextCell = next[index][levelGoals[lev]]
  nextCellX = Math.floor(nextCell % gridSize)
  nextCellY = Math.floor(nextCell / gridSize)
  
  nextPos = indexToPosition(nextCellX,nextCellY,lev)
  velX = nextPos.x - x
  velY = nextPos.y - y
  len = Math.sqrt(velX*velX + velY*velY)
  vel = { x: velX/len, y: velY/len}
  return vel
  
# notes -> to check block, simply see if the floodfill visits all squares, hold counter

# i think do it as follows:  have a grid that for each square states whether a creep resides there
# then go through that list after floodfill is done and see if all those squares were updated with a distance

updateAI = ->
  #for i in [0..2]
   # if (dirtyLevel[i])  # a level is dirty when a tower is placed
   
  floodInit()
  floodFill(levelGoals[0],0)
  floodFill(levelGoals[1],1)
  floodFill(levelGoals[2],2)
      
  # work out paths for creeps on level i

  for creature in level.creatures.creatures
    lev = creature.level
    index = creature.getGridIndex()
    # for now this is not gonna be very efficient, basically 
    # regenerate each path for each creep on a node. this should be shared [cache creep locations]
    #if (dirtyLevel[lev])
    if (creature.state == 1) # roaming
      floodFillGenPath(index,lev)
        
  # everything ready
  for i in [0..2]
    dirtyLevel[i] = false
      
      
  

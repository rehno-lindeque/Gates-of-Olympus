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
Globals
###

# Canvas
canvasSize = [1020.0, 800.0]

# Platforms
gridSize = 12                   # number of grid cells in one row/column
sqrGridSize = square(gridSize)  # total number of grid cells
levels = 3                      # number of platforms
cellScale = 0.9                 # size of a grid cell in world space

platformHeights = [
    cellScale*10 + 1.15
    1.15
    cellScale*-11 + 1.15 ]
  
platformLengths = [
    0.78 * 0.5 * cellScale * gridSize
    1.00 * 0.5 * cellScale * gridSize
    1.22 * 0.5 * cellScale * gridSize ]

# Towers
numTowerTypes = 3

# State
guiDiasRotVelocity = [
  0.0, 0.0
  0.0, 0.0
  0.0, 0.0 ]

guiDiasRotPosition = [
  0.0, 0.0
  0.0, 0.0
  0.0, 0.0 ]
  
# Input
towerPlacement = 
  level: -1
  cell: { x: -1, y: -1 }

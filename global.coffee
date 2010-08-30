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
canvasSize = [1020.0, 800.0]
gameSceneOffset = [3.0, 0.0, 0.0]

# Platforms
gridSize = 12                   # number of grid cells in one row or column
gridHalfSize = gridSize/2       # half the number of cells in one row or column
sqrGridSize = square(gridSize)  # total number of grid cells
levels = 3                      # number of platforms
cellScale = 0.9                 # size of a grid cell in world space

platformHeights = [
    cellScale*10 + 1.15
    1.15
    cellScale*-11 + 1.15 ]

platformScales = [0.78, 1.00, 1.22]
  
platformLengths = [
    platformScales[0] * 0.5 * cellScale * gridSize
    platformScales[1] * 0.5 * cellScale * gridSize
    platformScales[2] * 0.5 * cellScale * gridSize ]

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

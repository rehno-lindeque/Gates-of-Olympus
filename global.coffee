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

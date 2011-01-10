###
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Setup game events
###

numCreeps = 5
wave = 0

timeline = new Timeline

spawnScorpion = (time) ->
  level.creatures.addCreature(Scorpion)
  
spawnFish = (time) ->
  level.creatures.addCreature(Fish)
  
spawnSnake = (time) ->
  level.creatures.addCreature(Snake)

# very hacky but for now as to allow the events to fire in time, just add the new waves here (will fix after comp)
spawnCreepsEvent = (time) ->
  creepType = spawnScorpion
  if (wave % 3 == 1)
    creepType = spawnFish
  else if (wave % 3 == 2)
    creepType = spawnSnake
  
  spawnCreeps(time, numCreeps, creepType)
  wave++
  if (wave % 2 == 0)
    numCreeps++
  timeline.addEvent(1.0+ 15.0*wave, spawnCreepsEvent)
  
spawnCreeps = (time, num, type) ->
  #alert "Spawn scorpions"
  for i in [0..num]
    timeline.addEvent(time + i*0.5, type)
  null
  
  
timeline.addEvent(1.0, spawnCreepsEvent)


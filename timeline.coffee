###
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

class Timeline
  constructor: ->
    @events = new Array()
    @time = 0
    @index = 0
    null
  
  addEvent: (time, handler) ->
    @events[@events.length] = [time, handler]
    null
  
  update: (deltaTime) ->
    @time += deltaTime
    while @index < @events.length and @events[@index][0] <= @time
      # Run the event before removing it from the queue
      @events[@index][1](@time)
      @index = @index + 1
    null
  
  isFinished: ->
    @time > 0 and events.length == 0
    null

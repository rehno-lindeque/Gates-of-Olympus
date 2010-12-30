var creatureIds, creatureTextureURI, platformGeometry, towerIds, towerTextureURI;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Tower resources
*/
towerIds = ["ArcherTower", "CatapultTower", "BallistaTower"];
towerTextureURI = ["textures/archer.jpg", "textures/catapult.jpg", "textures/ballista.jpg"];
creatureIds = ["Scorpion", "Fish"];
creatureTextureURI = ["textures/scorpion.jpg", "textures/fish.jpg"];
/*
Platform resources
*/
platformGeometry = function(platformId) {
  var s;
  s = gridSize * cellScale * 0.5;
  return {
    type: "geometry",
    resource: platformId,
    id: platformId,
    primitive: "triangles",
    positions: [-s, s, 0, s, s, 0, s, -s, 0, -s, -s, 0],
    indices: [0, 1, 2, 0, 2, 3]
  };
};
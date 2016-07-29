/**
 * @author marcelfalliere
 */


var TILE_SIZE = 512,
    TILE_SEGMENTS = 130,

    GRID_SIZE = 3,

    TERRAIN_SEGMENTS = TILE_SEGMENTS*GRID_SIZE,
    TERRAIN_SIZE = TILE_SIZE*GRID_SIZE;


THREE.TerrainManager = function ( camera, scene ) {

  this.perlinData;

  this.waterLevel;

  this.camera = camera;

  this.scene = scene;

  this.tiles = _.range(GRID_SIZE).map(function() { return _.range(GRID_SIZE) })

  // for (var i = 0 ; i < GRID_SIZE ; i ++) {
  //   for (var j = 0 ; j < GRID_SIZE ; j ++) {
  //     var tile = new THREE.TerrainTile(perlinData, GRID_SIZE, TILE_SIZE, TILE_SEGMENTS, terrainColor, {x:i, y:j} );
  //     scene.add(tile);
  //   }
  // }

  this.prepare = function(){

     this.perlinData = generateHeight(TERRAIN_SEGMENTS+1,TERRAIN_SEGMENTS+1)
    //  this.perlinData = JSON.parse(localStorage.getItem('perlinData'));
    //  localStorage.setItem('perlinData', JSON.stringify(this.perlinData));

     var max = arrayMax(this.perlinData)
     var min = arrayMin(this.perlinData)
     this.waterLevel = (max + min) / 4
  }

  this.update = function(){

    var posX = Math.floor(this.camera.position.z / TILE_SIZE),
        posY = Math.floor(this.camera.position.x / TILE_SIZE);

    for (var i = 0 ; i < GRID_SIZE ; i++) {
      for (var j = 0 ; j < GRID_SIZE ; j++) {

        if ( [posX-1, posX, posX+1].indexOf(i) != -1
          && [posY-1, posY, posY+1].indexOf(j) != -1) {

          if (!(this.tiles[i][j] instanceof THREE.TerrainTile)) {
            this.tiles[i][j] = new THREE.TerrainTile(this.perlinData, GRID_SIZE, TILE_SIZE, TILE_SEGMENTS, terrainColor, {x:i, y:j}, this.waterLevel );
            this.scene.add(this.tiles[i][j])
          }
        } else if (this.tiles[i][j] instanceof THREE.TerrainTile) {

          this.scene.remove(this.tiles[i][j])
          this.tiles[i][j] = null
        }
      }
    }
  }

  this.getPerlinData = function(){
    return this.perlinData;
  }

  var generateHeight = function (width, height) {

    var size = width * height,
      data = new Uint8Array(size),
      perlin = new ImprovedNoise(),
      quality = 1,
      z = Math.random() * 100;

    for (var j = 0; j < 4; j++) {

      for (var i = 0; i < size; i++) {

        var x = i % width,
          y = ~~(i / width);
        data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

      }

      quality *= 5;

    }

    return data;

  }

};

THREE.TerrainManager.prototype.constructor = THREE.TerrainManager;

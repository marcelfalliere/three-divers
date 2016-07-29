/**
 * @author marcelfalliere
 */


var TILE_SIZE = 1024,
    TILE_SEGMENTS = 130,

    GRID_SIZE = 20,

    TERRAIN_SEGMENTS = TILE_SEGMENTS*GRID_SIZE,
    TERRAIN_SIZE = TILE_SIZE*GRID_SIZE;


THREE.TerrainManager = function ( camera, scene ) {

  this.previousPositon = { x:NaN, y:NaN }

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

  this.prepare = function(done){

    this.filer = new Filer();
    var self = this; // sugarrr

    var handlePerlinData = function(self, perlinData) {
      self.perlinData = perlinData;

      var max = arrayMax(self.perlinData)
      var min = arrayMin(self.perlinData)
      self.waterLevel = (max + min) / 6
      self.camera.position.x = TILE_SIZE / 2
      self.camera.position.y = 500
      self.camera.position.z = TILE_SIZE / 2

      if (done) done()
    }

    self.filer.init({persistent: true, size: ((TERRAIN_SEGMENTS+1)*(TERRAIN_SEGMENTS+1))*8 }, function(fs) {
      self.filer.ls('.', function(entries){

        if (_.find(entries, function(e) { return e.name=="perlinData.dat" }) == undefined) {

          debug("TerrainManager # generating data");
          var data = generateHeight(TERRAIN_SEGMENTS+1,TERRAIN_SEGMENTS+1)
          handlePerlinData(self, data);
          debug("TerrainManager # data generated");

          self.filer.write("perlinData.dat", {
            type: 'text/plain',
            data: self.perlinData.toString()
          },
            function(fileEntry, fileWriter) {
              debug("TerrainManager # perlinData.dat written");
            }, function onError(e) {
              debug("TerrainManager # filter.write file error", e);
            }
          );

        } else {

          debug("TerrainManager # reading data file");

          self.filer.open("perlinData.dat", function(file) {
            // Use FileReader to read file.
            var reader = new FileReader();
            reader.onload = function(e) {
              var data = new Uint8Array(e.target.result.toString().split(",").map(function(e){ return parseInt(e) }))
              handlePerlinData(self, data)
            }
            reader.readAsText(file);
          }, function onError(e) {
            debug("TerrainManager # filter.open (.dat exists) error ", e);
          });

        }


      }, function onError(e) {
        debug("TerrainManager # filter.ls error", e);
      })
    }, function onError(e) {
      debug("TerrainManager # filter.init error", e);
    });
  }

  this.update = function(){

    var posX = Math.floor(this.camera.position.z / TILE_SIZE),
        posY = Math.floor(this.camera.position.x / TILE_SIZE);

    if (posX != this.previousPositon.x || posY != this.previousPositon.y) {
      debug("treating new position, ", posX, posY)
      this.previousPositon.x = posX;
      this.previousPositon.y = posY;
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

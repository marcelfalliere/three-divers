/**
 * @author marcelfalliere
 */


var TILE_SIZE = 1024,
    TILE_SEGMENTS = 230,

    GRID_SIZE = 3,

    TERRAIN_SEGMENTS = TILE_SEGMENTS*GRID_SIZE,
    TERRAIN_SIZE = TILE_SIZE*GRID_SIZE;


THREE.FMFTerrainManager = function ( camera, scene ) {

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
      self.camera.position.y = self.waterLevel + 30
      self.camera.position.z = TILE_SIZE / 2

      if (done) done()
    }

    self.filer.init({persistent: true, size: ((TERRAIN_SEGMENTS+1)*(TERRAIN_SEGMENTS+1))*8 }, function(fs) {
      self.filer.ls('.', function(entries){

        if (_.find(entries, function(e) { return e.name=="perlinData.dat" }) == undefined) {

          info("FMFTerrainManager # generating data");
          var data = generateHeight(TERRAIN_SEGMENTS+1,TERRAIN_SEGMENTS+1)
          handlePerlinData(self, data);
          debug("FMFTerrainManager # data generated");

          self.filer.write("perlinData.dat", {
            type: 'text/plain',
            data: self.perlinData.toString()
          },
            function(fileEntry, fileWriter) {
              info("FMFTerrainManager # perlinData.dat written");
            }, function onError(e) {
              error("FMFTerrainManager # filter.write file error", e);
            }
          );

        } else {

          info("FMFTerrainManager # reading data file...");

          self.filer.open("perlinData.dat", function(file) {
            // Use FileReader to read file.
            var reader = new FileReader();
            reader.onload = function(e) {
              info("FMFTerrainManager # it is read !...");
              var data = new Uint8Array(e.target.result.toString().split(",").map(function(e){ return parseInt(e) }))
              handlePerlinData(self, data)
            }
            reader.readAsText(file);
          }, function onError(e) {
            error("FMFTerrainManager # filter.open (.dat exists) error ", e);
          });

        }


      }, function onError(e) {
        error("FMFTerrainManager # filter.ls error", e);
      })
    }, function onError(e) {
      error("FMFTerrainManager # filter.init error", e);
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

            if (!(this.tiles[i][j] instanceof THREE.FMFTerrainTile)) {
              this.tiles[i][j] = new THREE.FMFTerrainTile(this.perlinData, GRID_SIZE, TILE_SIZE, TILE_SEGMENTS, terrainColor, {x:i, y:j}, this.waterLevel );
              this.scene.add(this.tiles[i][j])
            }
          } else if (this.tiles[i][j] instanceof THREE.FMFTerrainTile) {

            this.scene.remove(this.tiles[i][j])
            this.tiles[i][j] = null
          }
        }
      }
    }
  }

  this.deleteLocalFiles = function(done){

    var self = this; // sugarrr

    self.filer.init({persistent: true, size: ((TERRAIN_SEGMENTS+1)*(TERRAIN_SEGMENTS+1))*8 }, function(fs) {
      self.filer.ls('.', function(entries){

        if (_.find(entries, function(e) { return e.name.indexOf("perlinData.dat")!=-1 }) != undefined) {

          info("FMFTerrainManager # going to delete perlinData.dat");

          self.filer.rm("perlinData.dat",
            function() {
              info("FMFTerrainManager # perlinData.dat deleted!");
              done(0);
            }, function onError(e) {
              error("FMFTerrainManager # filter.write file error", e);
              done(3)
            }
          );

        } else {
          error("FMFTerrainManager # file not found", e);
          done(4);
        }
      }, function onError(e) {
        error("FMFTerrainManager # filter.ls error", e);
        done(1);
      })
    }, function onError(e) {
      error("FMFTerrainManager # filter.init error", e);
      done(2);
    });

  }

  this.getPerlinData = function(){
    return this.perlinData;
  }

};

THREE.FMFTerrainManager.prototype.constructor = THREE.FMFTerrainManager;

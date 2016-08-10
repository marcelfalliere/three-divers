
/**
* @author marcelfalliere
*/

var WATER_SIZE = 300,
    WATER_SEGMENTS = 50;

THREE.FMFWaterManager = function ( player, waterLevel ) {

  // Texture
  var texLoader = new THREE.TextureLoader();
  map = texLoader.load( 'resources/star-32.png' );

  // Target
  var target = player;

  // Heights maps to animate from
  // var heightMaps = [ generateHeight(WATER_SEGMENTS, WATER_SEGMENTS), generateHeight(WATER_SEGMENTS, WATER_SEGMENTS) ]
  var heightMaps = [ generateHeight(WATER_SEGMENTS, WATER_SEGMENTS)]

  // "Real" water plane
  var geometry = new THREE.PlaneBufferGeometry(WATER_SIZE,WATER_SIZE, WATER_SEGMENTS-1, WATER_SEGMENTS-1 )
      texture = new THREE.ImageUtils.loadTexture( 'resources/water.png' );
  texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
  var material = new THREE.MeshPhongMaterial({
                  color:waterColor,
                  map:texture,
                  wireframe:false,
                  fog:true,
                  emissive:waterColor,
                  emissiveIntensity:0.9
                });

  this.mesh = new THREE.Mesh(geometry, material)
  this.mesh.rotation.x = -Math.PI / 2;
  this.mesh.position.y = terrainManager.waterLevel - 1;

  // Water vertices animation
  var vertices = geometry.attributes.position.array;
  var data = heightMaps.random();
  var directions = {};
  for ( var i = 0, j = 2, l = vertices.length; i < l; i ++, j += 3 ) {
    vertices[j] = randomFloatBetween(-1, 1);
    directions["v"+j] = Math.round(Math.random()) % 2
  }
  geometry.attributes.position.needsUpdate = true;

  // "Far" water not animated
  var farGeometry = new THREE.PlaneBufferGeometry(TILE_SIZE*2, TILE_SIZE*2);
  var farMaterial = new THREE.MeshPhongMaterial({
                  color:waterColor,
                  wireframe:false,
                  fog:true,
                  emissive:waterColor,
                  emissiveIntensity:0.9
                });
  this.farMesh = new THREE.Mesh(farGeometry, farMaterial);
  this.farMesh.rotation.x = -Math.PI / 2;
  this.farMesh.position.y = terrainManager.waterLevel - 1;

  // Update function
  this.update = function() {
    this.mesh.position.x = target.position.x;
    this.mesh.position.z = target.position.z;

    this.farMesh.position.x = target.position.x;
    this.farMesh.position.z = target.position.z;

    var vertices = geometry.attributes.position.array;
    var data = heightMaps.random();
    var speed = .01;
    for ( var i = 0, j = 2, l = vertices.length; i < l; i ++, j += 3 ) {
      var currentY = vertices[j];
      var targetY = data[i];
      var dir = directions["v"+j];
      var verticeSpeed = randomFloatBetween(0,1) * speed;

      if (dir == 1 && currentY > 1.0 ) { // vers le haut et sup à limit sup
        currentY-=verticeSpeed;
        directions["v"+j] = 0;
      } else if (dir == 0 && currentY < -1.0 ) { // vers le bas et inf à la limit inf
        currentY+=verticeSpeed;
        directions["v"+j] = 1;
      } else if (dir == 1) {
        currentY+=verticeSpeed;
      } else if (dir == 0) {
        currentY-=verticeSpeed;
      }

      vertices[j]=currentY;
    }
    geometry.attributes.position.needsUpdate = true;

  }


  this.addToScene = function(scene) {
    scene.add(this.mesh)
    scene.add(this.farMesh)
  }


}


THREE.FMFWaterManager.prototype.constructor = THREE.FMFWaterManager;

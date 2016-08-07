
/**
* @author marcelfalliere
*/

var WATER_SIZE = TILE_SIZE * 2;

THREE.FMFWaterManager = function ( player, waterLevel ) {

  // Texture
  var texLoader = new THREE.TextureLoader();
  map = texLoader.load( 'resources/star-32.png' );

  // Target
  var target = controls.bird;

  // Actual water plane
  var geometry = new THREE.PlaneBufferGeometry(WATER_SIZE,WATER_SIZE, Math.round(WATER_SIZE/10), Math.round(WATER_SIZE/10) )
  var material = new THREE.MeshPhongMaterial({
    color:waterColor,
    wireframe:true
  })
  this.mesh = new THREE.Mesh(geometry, material)
  this.mesh.rotation.x = -Math.PI / 2;
  this.mesh.position.y = terrainManager.waterLevel;

  // Update function
  this.update = function() {
    this.mesh.position.x = target.position.x;
    this.mesh.position.z = target.position.z;
  }


  this.addToScene = function(scene) {
    scene.add(this.mesh)
  }


}


THREE.FMFWaterManager.prototype.constructor = THREE.FMFWaterManager;

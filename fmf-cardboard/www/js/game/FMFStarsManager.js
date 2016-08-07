/**
* @author marcelfalliere
*/


var STARS_SIZE = 3000,
    STARS_COUNT = 7000;

THREE.FMFStarsManager = function ( player ) {

  this.group = new THREE.Group();

  // Texture
  var texLoader = new THREE.TextureLoader();
  map = texLoader.load( 'resources/star-32.png' );

  // Target
  var target = controls.bird,
      target_pos = new THREE.Vector2(target.position.x, target.position.z);

  // Group position
  this.group.position.x = target.position.x - STARS_SIZE/2;
  this.group.position.z = target.position.z - STARS_SIZE/2;

  // Particle creation loop
  for (var i = 0 ; i < STARS_COUNT ; i++) {

    var material = new THREE.SpriteMaterial( {
      color: Math.random() * 0xFF0000 + 0x0F0F00,
      map: map
    });

    particle = new THREE.Sprite(material);

    particle.position.x = Math.random() * STARS_SIZE;
    particle.position.z = Math.random() * STARS_SIZE;

    var particle_pos = new THREE.Vector2(particle.position.x, particle.position.z);
    var distanceToBird = particle_pos.distanceTo(target_pos);

    particle.position.y = Math.max(terrainManager.waterLevel,terrainManager.waterLevel + STARS_SIZE/2 - distanceToBird )

    particle.scale.x = particle.scale.y = Math.random() * (STARS_SIZE/2 - distanceToBird) * 0.008;

    this.group.add( particle );
  }

  // Update function
  this.update = function() {
    this.group.position.x = target.position.x - STARS_SIZE/2;
    this.group.position.z = target.position.z - STARS_SIZE/2;
  }


  this.addToScene = function(scene) {
    scene.add(this.group)
  }


}


THREE.FMFStarsManager.prototype.constructor = THREE.FMFStarsManager;

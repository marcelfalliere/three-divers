/**
 * @author marcelfalliere
 */

THREE.FMFControls = function ( camera, scene, birdColor ) {

	debug("FMFControls # init");

	this.camera = camera;
  this.birdColor = birdColor;

  this.radius = 80; // radius between camera and player
  this.teta = 0; // dernier angle sur le cercle trigo de la camera autour du bird sur le plan x/z
  this.phi = Math.PI/2; // dernier angle sur Y

  this.cameraSpeedHorizontal = 50;
  this.cameraSpeedVertical = 100;

  // Button/Mouse states
  this.cameraUp = false;
  this.cameraLeft = false;
  this.cameraDown = false;
  this.cameraRight = false;
  this.birdControls = {
    "e" : false
  }

  // Bird
  this.bird = new THREE.FMFPlayer( this, camera, birdColor ); // the player
  this.bird.addToScene(scene);

  // Events
  this.onKeyDown = function ( event ) {
		//event.preventDefault();
		switch ( event.keyCode ) {
			case 38: /*up*/   this.cameraUp = true; break;
			case 37: /*left*/ this.cameraLeft = true; break;
			case 40: /*down*/ this.cameraDown = true; break;
			case 39: /*right*/this.cameraRight = true; break;
      case 69: /*e*/    this.birdControls.e = true; break;
		}
	};
	this.onKeyUp = function ( event ) {
		switch ( event.keyCode ) {
      case 38: /*up*/   this.cameraUp = false; break;
			case 37: /*left*/ this.cameraLeft = false; break;
			case 40: /*down*/ this.cameraDown = false; break;
			case 39: /*right*/this.cameraRight = false; break;
      case 69: /*e*/    this.birdControls.e = false; break;
		}
	};

  // Init the camera, and the bird, at position
  this.initAtPosition = function(x,y,z) {
    this.camera.position.x = x + this.radius * Math.cos(this.teta);
    this.camera.position.z = z + this.radius * Math.sin(this.teta);
    this.camera.position.y = y + this.radius * Math.cos(this.phi);
    this.bird.initAtPosition(x,y,z);
    this.camera.lookAt( this.bird.mesh.position );

  }

  // Update
  var toBack = false;
	var raycaster = new THREE.Raycaster();
	// Camera position update
	var speedX = .5,
			speedY = 0.1,
			maxY = 80,
			minY = 20,
			directionY = -1;

  this.update = function(delta, elapsedSeconds) {

    // Bird update
    this.bird.update(delta, elapsedSeconds, this.birdControls);

		var distanceToBird = this.camera.position.distanceTo(this.bird.position);

		// this.camera.translateY(-0.01);
		//
		// if (this.camera.position.y <= minY) {
		// 	directionY = 1;
		// } else if (this.camera.position.y >= maxY) {
		// 	directionY = -1;
		// }

		// this.camera.translateY(speedY * directionY);
		// this.bird.mesh.translateY(speedY * directionY);

		//
		// if (toBack && distanceToBird <= this.bird.mesh.geometry.parameters.radius + 20) {
		// 	toBack=false;
		// }
		//
		// if (distanceToBird >= this.bird.mesh.geometry.parameters.radius && distanceToBird < maxDistance && !toBack ) {
		// 	this.camera.translateZ(speed);
		// } else {
		// 	toBack = true;
		// 	this.camera.translateZ(-speed);
		// }
		//
		// raycaster.set(this.camera.position, new THREE.Vector3(0,-1,0));
		// var intersects = raycaster.intersectObjects( scene.children );
		// if(_.some(intersects, function(i) { i.distance < 10 })) {
		// 	this.camera.translateY(20);
		// 	consoe.log("yo")
		// }

    // this.camera.lookAt( this.bird.position );

  }

  // Lifecycle
  this.dispose = function() {
		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );
	}

  // Bindings events
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );
	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

  // Util : bing function
	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}

};

THREE.FMFControls.prototype = Object.create( THREE.FirstPersonControls.prototype );
THREE.FMFControls.prototype.constructor = THREE.FMFControls;

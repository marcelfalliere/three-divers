
/**
 * @author marcelfalliere
 */

THREE.FMFPlayer = function ( controls, camera, birdColor ) {

	debug("FMFPlayer # init");

  this.camera = camera;

  this.controls = controls;

  this.bodyParts = {
    head:null,
    body:null,
    wings: {
      left:null,
      right:null
    }
  }

  this.speed = 0.9;


  // Light
  this.pointLight = new THREE.PointLight( 0xFFFFFF, 0.5 );

	// New body ! v2
	var body_geometry = new THREE.SphereGeometry( 5, 30, 25 );
	this.uniforms = {
		time:       { value: 1.0 },
		resolution: { value: new THREE.Vector2() }
	};
	var material = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		vertexShader: document.getElementById( 'default-vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'bird-fragmentShader' ).textContent
	});
	this.mesh = new THREE.Mesh(body_geometry, material);
	this.position = this.mesh.position;

	// this.mesh = new THREE.Object3D();
	// this.position = this.mesh.position;
	//
  // Bird is composed of :
  // var body_geometry = new THREE.SphereGeometry( 3, 30, 25 ),
  //     // head_geometry = new THREE.SphereGeometry( 3, 16, 12 ),
  //     // wingR_geometry = new THREE.CircleBufferGeometry( 3, 32, 0, Math.PI ),
  //     // wingL_geometry = new THREE.CircleBufferGeometry( 3, 32, 0, Math.PI ), // and ....
  //     material = new THREE.MeshLambertMaterial({color : this.birdColor, wireframe:on_debug, side:THREE.DoubleSide });
	//
  // // Head setup
  // // head_geometry.applyMatrix( new THREE.Matrix4().makeScale(.3,.3,.3) );
  // // this.bodyParts.head = new THREE.Mesh(head_geometry, material)
  // // this.bodyParts.head.rotation.z = Math.PI/8;
  // // this.bodyParts.head.position.x = -4;
  // // this.bodyParts.head.position.y = 5;
  // // this.mesh.add(this.bodyParts.head);
	//
  // // Body setup
  // body_geometry.applyMatrix( new THREE.Matrix4().makeScale( 1.0, 1.0, 1.0 ) );
  // this.bodyParts.body = new THREE.Mesh(body_geometry, material);
  // this.bodyParts.body.rotation.y = Math.PI/2;
  // this.bodyParts.body.position.y = 0;
  // this.mesh.add(this.bodyParts.body);

  // Right Wing setup
  // wingR_geometry.applyMatrix( new THREE.Matrix4().makeScale(1.8,5.0,1.0));
  // this.bodyParts.wings.right = new THREE.Mesh( wingR_geometry, material );
  // this.bodyParts.wings.right.rotation.x = -Math.PI/2
  // this.mesh.add(this.bodyParts.wings.right);
	//
  // // Left Wing setup
  // wingL_geometry.applyMatrix( new THREE.Matrix4().makeScale(1.8,5.0,1.0));
  // this.bodyParts.wings.left = new THREE.Mesh( wingL_geometry, material );
  // this.bodyParts.wings.left.rotation.x = Math.PI/2
  // this.mesh.add(this.bodyParts.wings.left);



  //
  this.initAtPosition = function(x,y,z) {
    this.mesh.position.set(x,y,z)
    this.lastDir = new THREE.Vector3(-1,0,0)
  }

  this.addToScene = function(scene) {
    scene.add(this.pointLight);
    scene.add(this.mesh);
  }

  // Update
  this.update = function(delta, elapsedSeconds, birdControls) {
    this.birdControls = birdControls;
    this.motion();
    this.pointLight.position.set(this.mesh.position.x, this.mesh.position.y-3, this.mesh.position.z );

		this.uniforms.time.value += delta * 100;

  }

  // Process bird motion
  this.motion = function() {
    if (this.birdControls.e) { // Move in the main direction

      var pLocal = new THREE.Vector3( 0, 0, -1 );

      this.mesh.rotation.y = 2*Math.PI - this.controls.teta;
      this.mesh.rotation.z = (-1)*(this.controls.phi-Math.PI/2)
      // this.mesh.rotation.y = this.mesh.rotation.y + 0.1;

      pLocal.applyAxisAngle(new THREE.Vector3(0,1,0), -1 * this.mesh.rotation.y)
      pLocal.applyAxisAngle(new THREE.Vector3(0,0,1), -1 * this.mesh.rotation.z)
      pLocal.normalize();

      var pWorld = pLocal.applyMatrix4( this.camera.matrixWorld );
      var dir = pWorld.sub( this.camera.position ).normalize();

      this.mesh.translateX(this.speed*dir.x)
      this.mesh.translateY(this.speed*dir.y)
      this.mesh.translateZ(this.speed*dir.z)


      // this.mesh.rotation.y = 2*Math.PI - this.controls.teta

    }
  }

  // Lifecycle
  this.dispose = function() {
	}

};

THREE.FMFPlayer.prototype = Object.create( THREE.FirstPersonControls.prototype );
THREE.FMFPlayer.prototype.constructor = THREE.FMFPlayer;

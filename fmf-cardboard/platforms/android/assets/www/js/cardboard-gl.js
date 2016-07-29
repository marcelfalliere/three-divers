angular.module('fmfcardboard-app')

.directive('cardboardGl', [function() {

  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      create($element[0]);
    }
  }

  function create(glFrame) {
    var scene,
        camera,
        renderer,
        element,
        container,
        effect,
        controls,
        wsGamepadControls,
        clock,

        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

        // colors
        fogColor = 0xeab5ef,
        skyColor = 0xeab5ef,
        terrainColor = 0x10593f,

        // terrain
        TERRAIN_SEGMENTS = 150,
        TERRAIN_SIZE = 1024;

    init();

    function init() {
      scene = new THREE.Scene();

      // Renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setClearColor(skyColor);
      element = renderer.domElement;
      container = glFrame;
      container.appendChild(element);
      effect = new THREE.StereoEffect(renderer);

      // Camera
      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);
      // camera.position.x = 0;
      // camera.position.z = 0;
      scene.add(camera);

      // Controls
      if (isMobile) {
        function setOrientationControls(e) {
          if (!e.alpha) {
            return;
          }

          controls = new THREE.DeviceOrientationControls(camera, true);
          controls.connect();
          controls.update();

          element.addEventListener('click', fullscreen, false);

          window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
        window.addEventListener('deviceorientation', setOrientationControls, true);
      } else {
        // console.log("OrbitControls")
        // controls = new THREE.OrbitControls(camera, element);
        // controls.enableDamping = true;
				// controls.dampingFactor = 0.25;
				// controls.enableZoom = false;
      }
      wsGamepadControls = new THREE.SocketGamepadControls(camera);


      // Fog
      scene.fog = new THREE.FogExp2(fogColor, .009)

      // Terrain
      var geometry = new THREE.PlaneBufferGeometry( TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGMENTS - 1, TERRAIN_SEGMENTS - 1);
      material = new THREE.MeshLambertMaterial({color : terrainColor});
      mesh = new THREE.Mesh( geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0;
      mesh.position.x = 0;
			scene.add( mesh );
      var vertices = geometry.attributes.position.array;
      var perlinData = generateHeight(TERRAIN_SEGMENTS,TERRAIN_SEGMENTS)
      console.log("perlinData", perlinData);
      for ( var i = 0, j = 2 ; i < vertices.length ; i ++, j += 3 ) {
        vertices[j] = perlinData[i]
      }
      geometry.computeVertexNormals();
      camera.position.y = perlinData[ Math.round(TERRAIN_SEGMENTS * TERRAIN_SEGMENTS / 2)  ] + 100;

      // Cube vert pour se repérer un peu
      var geometry = new THREE.BoxGeometry( 2, 2, 2 );
			var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
			mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = 0;
      mesh.position.y = 0;
      mesh.position.z = 0;
			scene.add( mesh );

      // Light
			dirLight = new THREE.DirectionalLight( 0x00ffff, 1 );
			dirLight.position.set( 0, camera.position.y, 0 );
			dirLight.position.multiplyScalar( 50 );
			scene.add( dirLight );

      // Animate
      clock = new THREE.Clock();
      animate();
    }

    function generateHeight( width, height ) {

      var size = width * height, data = new Uint8Array( size ),
      perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

      for ( var j = 0; j < 4; j ++ ) {
        for ( var i = 0; i < size; i ++ ) {
          var x = i % width, y = ~~ ( i / width );
          data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
        }
        quality *= 5;
      }

      return data;
    }

    function animate() {
      var elapsedSeconds = clock.getElapsedTime();

      requestAnimationFrame(animate);

      update(clock.getDelta());
      render(clock.getDelta());
    }

    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      if (isMobile)
        effect.setSize(width, height);
    }

    function update(dt) {
      resize();

      //camera.updateProjectionMatrix();

      if (controls)
        controls.update(dt);
      wsGamepadControls.update(dt);
    }

    function render(dt) {
      if (isMobile)
        effect.render(scene, camera);
      else
        renderer.render(scene, camera);
    }

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }

    window.camera = camera;
    window.renderer = renderer;
    window.scene = scene;
  }
}]);

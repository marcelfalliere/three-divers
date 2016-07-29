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
        terrainMesh,
        waterMesh,

        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

        // colors
        fogColor = 0xeab5ef,
        skyColor = 0xeab5ef,
        terrainColor = 0x3E8F22,
        waterColor = 0x88BDCF,

        // terrain
        TERRAIN_SEGMENTS = 240,
        TERRAIN_SIZE = 1000;

    init();

    function init() {
      scene = new THREE.Scene();

      // Renderer
      renderer = new THREE.WebGLRenderer({
        alpha:true
      });
      //renderer.setClearColor(fogColor, 0);
      // debugger;
      element = renderer.domElement;
      container = glFrame;
      container.appendChild(element);
      effect = new THREE.StereoEffect(renderer);

      // Camera
      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 800);
      camera.position.z = TERRAIN_SIZE / 2;
      camera.position.y = 200;
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
        controls = new THREE.OrbitControls(camera, element);
        controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = false;
      }

      // Fog
      scene.fog = new THREE.FogExp2(fogColor, .0029)

      // Terrain
      var geometry = new THREE.PlaneBufferGeometry( TERRAIN_SIZE, TERRAIN_SIZE, parseInt(TERRAIN_SEGMENTS - 1), parseInt(TERRAIN_SEGMENTS - 1));
      material = new THREE.MeshLambertMaterial({color : terrainColor, wireframe:false});
      terrainMesh = new THREE.Mesh( geometry, material);
      terrainMesh.rotation.x = -Math.PI / 2;
      terrainMesh.position.y = 0;
      terrainMesh.position.x = 0;
			scene.add( terrainMesh );
      var vertices = geometry.attributes.position.array;
      var perlinData = generateHeight(TERRAIN_SEGMENTS,TERRAIN_SEGMENTS)
      console.log("perlinData", perlinData);
      for ( var i = 0, j = 2 ; i < vertices.length ; i ++, j += 3 ) {
        vertices[j] = perlinData[i]
      }
      geometry.computeVertexNormals(); // update pour la lumière
      camera.position.y = perlinData[ Math.round(TERRAIN_SEGMENTS * TERRAIN_SEGMENTS / 2)  ] + 100;
      terrainMesh.updateMatrix();
      terrainMesh.geometry.applyMatrix( terrainMesh.matrix );
      terrainMesh.matrix.identity();
      terrainMesh.position.set( 0, 0, 0 );
      terrainMesh.rotation.set( 0, 0, 0 );
      terrainMesh.scale.set( 1, 1, 1 );

      // Water
      var waterLevel = 50; // TODO : find depending on perlin data ?
      var geometry = new THREE.PlaneBufferGeometry(TERRAIN_SIZE,TERRAIN_SIZE)
      var material = new THREE.MeshPhongMaterial({
        color:waterColor
      })
      waterMesh = new THREE.Mesh(geometry, material)
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.y = 50;
      scene.add(waterMesh)

      // Camera near water
      camera.position.y = waterLevel + 20;

      // Spheres
      // var vertices = geometry.attributes.position.array;
      // for ( var i = 0 ; i < vertices.length ; i += 3*32 ) {
      //   var geometry = new THREE.SphereGeometry( 5, 32, 2 );
  		// 	var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  		// 	mesh = new THREE.Mesh( geometry, material );
      //   mesh.position.x = vertices[i]; // + Math.round((Math.random()-0.5)*100);
      //   mesh.position.y = vertices[i+1]; // - Math.round(Math.random()*50);
      //   mesh.position.z = vertices[i+2]; // + Math.round((Math.random()-0.5)*100);
  		// 	scene.add( mesh );
      // }

      // Cube vert pour se repérer un peu
      var geometry = new THREE.BoxGeometry( 2, 2, 2 );
			var material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
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
      if (wsGamepadControls)
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
    window.waterMesh = waterMesh;
  }
}]);

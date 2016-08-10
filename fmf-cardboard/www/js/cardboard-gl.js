
var scene,
    camera,
    renderer,
    element,
    container,
    effect,
    controls,
    wsGamepadControls,
    clock,
    stats,
    pointLight,

    // managers
    starsManager,
    waterManager,
    terrainManager,

    // options
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

    // colors
    // fogColor = 0xeab5ef,
    clearColor = 0x1E1E43,
    fogColor = 0x462666,
    // fogColor = 0x000000,
    skyColor = 0xeab5ef,
    terrainColor = 0x3E8F22,
    waterColor = 0xF50167,
    lightColor =  0x00ffff,
    birdColor = 0xeab5ef,

    // fog
    fogDensity = 0.004925,


    // gui
    foo='bar';



angular.module('fmfcardboard-app')

.directive('cardboardGl', [function() {

  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      create($element[0]);
    }
  }

  function create(glFrame) {

    container = glFrame

    init(function(){
      animate();
    });

    function init(done) {

      // Camera
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

      // Scene and Fog
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(fogColor, fogDensity);


      // Renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(clearColor);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.innerHTML = "";
      container.appendChild(renderer.domElement);


      // Terrain Manager <-- Terrain Tile
      terrainManager = new THREE.FMFTerrainManager(camera, scene)
      terrainManager.prepare(function(){

      // Controls
      controls = new THREE.FMFControls(camera, scene, birdColor);
      // Camera initial position // TODO : ray cast at this position and add some y's
      controls.initAtPosition(
        // Math.round((TILE_SIZE*GRID_SIZE)/2),
        // terrainManager.waterLevel + 130,
        // Math.round((TILE_SIZE*GRID_SIZE)/2)
        1876.9658717988589,
        58.75332999365925,
        1714.061042652928
      )

      // Water Manager ... TODO

      // // Update après les rotations etc..
      // debug(yMin, yMax)
      // geometry.computeVertexNormals(); // update pour la lumière
      // terrainMesh.updateMatrix();
      // terrainMesh.geometry.applyMatrix( terrainMesh.matrix );
      // terrainMesh.matrix.identity();
      // terrainMesh.position.set( 0, 0, 0 );
      // terrainMesh.rotation.set( 0, 0, 0 );
      // terrainMesh.scale.set( 1, 1, 1 );

      // Troisème passe pour les intersections avec l'eau
      // debug("vertices", vertices);
      // var intersections = [];
      // for ( var i = 0, j = 1 ; i < vertices.length ; i ++, j += 3  ) {
      //   // si l'actuel est inférieur à l'eau est que le suivant est supérieur : intersection !
      //   if (j+3 < vertices.length && vertices[j] < waterLevel && vertices[j+3] > waterLevel ) {
      //     debug("yo")
      //     intersections.push(new THREE.Vector3(vertices[j-1], vertices[j], vertices[j+1]))
      //   }
      // }
      // debug("intersections", intersections);

      // Sphere (yellow) for intersections
      // intersections.forEach(function(intersection){
      //
      //   // SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
      //   var geometry = new THREE.SphereGeometry( 10 , 5, 20, 0, Math.PI*2, 0.5, Math.PI );
      //  	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
      //  	var mesh = new THREE.Mesh( geometry, material );
      //   mesh.position.set(intersection.x, intersection.y, intersection.z);
      //   // var k = new THREE.Mesh( new THREE.TetrahedronGeometry( 75, 0 ), material);
      //   // var k = cone.clone();
      //   // k.position.set(intersection);
      //   scene.add(mesh);
      // })

      // Water
      waterManager = new THREE.FMFWaterManager(controls.bird, terrainManager.waterLevel);
      waterManager.addToScene(scene)


      // Light

      // AmbientLight
      // scene.add( new THREE.AmbientLight( lightColor ) );

      // DirectionLight
			// dirLight = new THREE.DirectionalLight(lightColor =  0x00ffff, 1 );
			// dirLight.position.set( 0, 0, 0 );
			// dirLight.position.multiplyScalar( 5000 );
			// scene.add( dirLight );

      // HemisphereLight
    	// hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    	// hemiLight.color.setHSL( 0.6, 1, 0.6 );
    	// hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    	// hemiLight.position.set( 0, 500, 0 );
    	// scene.add( hemiLight );

      // Stars
      starsManager = new THREE.FMFStarsManager(camera);
      starsManager.addToScene(scene)

      // Stats
      stats = new Stats();
      container.appendChild(stats.dom);

      // Clock
      clock = new THREE.Clock();

      // Arrow Helpers
      var axisHelper = new THREE.FMFOriginHelper( TERRAIN_SIZE / TERRAIN_SEGMENTS );
      scene.add(axisHelper);


      // for (var i = 0 ; i < GRID_SIZE*TILE_SIZE ; i += 100) {
      //   for (var j = 0 ; j < GRID_SIZE*TILE_SIZE ; j += 100) {
      //     var geo = new THREE.BoxGeometry(20, 20, 20);
      //     var mat = new THREE.MeshLambertMaterial({color:0X333333 * Math.random() });
      //     var mesh = new THREE.Mesh(geo, mat)
      //     mesh.position.set(i, terrainManager.waterLevel + 20 ,j)
      //     scene.add(mesh)
      //   }
      // }

      // UI
      var gui = new dat.GUI(),
          GuiController = function(){
              this.newPerlinData =  function(){
                  terrainManager.deleteLocalFiles(function(code){
                    if (code==0) {
                      location.reload()
                    } else {
                      alert("Error! Check the console.")
                    }
                  });
              }
          },
          guiController = new GuiController();

			gui.add(guiController, "newPerlinData");


      // Listener
      window.addEventListener('resize', resize, false);

      if (done) done()

      });

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


    function animate() {
      var elapsedSeconds = clock.getElapsedTime();

      requestAnimationFrame(animate);

      stats.update();

      controls.update(clock.getDelta(), clock.getElapsedTime());
      // wsGamepadControls.update(dt);

      terrainManager.update();
      starsManager.update();
      waterManager.update(renderer, scene);

      if (effect) {
        effect.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }

    }


  }
}]);

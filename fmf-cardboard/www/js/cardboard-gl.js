
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

    // mesh
    terrainManager,
    waterMesh,

    // options
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

    // colors
    // fogColor = 0xeab5ef,
    fogColor = 0x000000,
    skyColor = 0xeab5ef,
    terrainColor = 0x3E8F22,
    waterColor = 0x88BDCF,
    lightColor =  0x00ffff,

    // fog
    fogDensity = 0.0000325,

    // water
    waterLevel = 0,

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

      // Controls
      controls = new THREE.FirstPersonControls(camera);
      controls.movementSpeed = 15000;
      controls.lookSpeed = 10;
      controls.mouseDragOn = true;
      // Orbit controls...
      // controls = new THREE.OrbitControls(camera);
      // controls.target = new THREE.Vector3(0,0,0);
      // controls.enableDamping = true;
			// controls.dampingFactor = 0.25;
			// controls.enableZoom = true;

      // Scene and Fog
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(fogColor, fogDensity);

      // Terrain

      terrainManager = new THREE.TerrainManager(camera, scene)
      terrainManager.prepare(function(){

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
      // var geometry = new THREE.PlaneBufferGeometry(TERRAIN_SIZE,TERRAIN_SIZE)
      // var material = new THREE.MeshPhongMaterial({
      //   color:waterColor
      // })
      // waterMesh = new THREE.Mesh(geometry, material)
      // waterMesh.rotation.x = -Math.PI / 2;
      // waterMesh.position.y = waterLevel;
      // scene.add(waterMesh)

      // Light

      // AmbientLight
      // scene.add( new THREE.AmbientLight( lightColor ) );

      // DirectionLight
			// dirLight = new THREE.DirectionalLight(lightColor =  0x00ffff, 1 );
			// dirLight.position.set( 0, 0, 0 );
			// dirLight.position.multiplyScalar( 5000 );
			// scene.add( dirLight );

      // HemisphereLight
    	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    	hemiLight.color.setHSL( 0.6, 1, 0.6 );
    	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    	hemiLight.position.set( 0, 500, 0 );
    	scene.add( hemiLight );
      //
    	// dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    	// // dirLight.color.setHSL( 0.5, 0.5, 0.5 );
    	// dirLight.position.set( 0,10500,0 );
    	// dirLight.position.multiplyScalar( 1 );
    	// scene.add( dirLight );
    	// dirLight.castShadow = true;

      // Pointlight
			pointLight = new THREE.PointLight( 0xff4400, 1.5 );
			pointLight.position.set(camera.position.x, terrainManager.waterLevel + 50, camera.position.z );
			scene.add( pointLight );

      // Renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(fogColor);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // Stats
      stats = new Stats();
      container.appendChild(stats.dom);

      // Clock
      clock = new THREE.Clock();

      // Terrain Helpers
      // var helper = new THREE.GridHelper( TERRAIN_SIZE / 2, TERRAIN_SEGMENTS, 0x0000ff, 0x808080 );
			// helper.position.y = waterLevel;
			// scene.add( helper );

      // Arrow Helpers
      var axisHelper = new THREE.OriginHelper( TERRAIN_SIZE / TERRAIN_SEGMENTS );
      scene.add(axisHelper);

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

      // var matrix = new THREE.Matrix4().makeRotationY(-0.02);
      // camera.applyMatrix(matrix);

      // bouger dans une direction
      // var caster = new THREE.Raycaster();
      // this.rays = [
      //   new THREE.Vector3(0, 0, 1),
      //   new THREE.Vector3(1, 0, 1),
      //   new THREE.Vector3(1, 0, 0),
      //   new THREE.Vector3(1, 0, -1),
      //   new THREE.Vector3(0, 0, -1),
      //   new THREE.Vector3(-1, 0, -1),
      //   new THREE.Vector3(-1, 0, 0),
      //   new THREE.Vector3(-1, 0, 1)
      // ];

      // camera.updateMatrixWorld();

      stats.update();

      controls.update(clock.getDelta());
      // wsGamepadControls.update(dt);

      terrainManager.update();

      if (effect) {
        effect.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }

    }


  }
}]);

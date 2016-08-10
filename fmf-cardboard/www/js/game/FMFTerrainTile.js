/**
 * @author marcelfalliere
 */

THREE.FMFTerrainTile = function ( perlinData, nbTiles, size, segments, terrainColor, position, waterLevel ) {

	debug("FMFTerrainTile # perlinData.length->",perlinData.length," nbTiles->",nbTiles," size->",size," segments->",segments," terrainColor->",terrainColor," position->",position, " waterLevel->",waterLevel);

	this.perlinData = perlinData;

	var geometry = new THREE.PlaneBufferGeometry( size, size, parseInt(segments), parseInt(segments)),
			material1 = new THREE.MeshLambertMaterial({color : terrainColor, wireframe:on_debug }),
			material2 = new THREE.ShaderMaterial({
									 fog:true,
									 transparent:true,
										uniforms: THREE.UniformsUtils.merge([
												THREE.UniformsLib[ "fog" ], {
													waterLevel: { value : waterLevel }
												}
											]),
										vertexShader: document.getElementById( 'default-vertexShader' ).textContent,
										fragmentShader: document.getElementById( 'terrain-fragmentShader' ).textContent
									});

	var material = material2;

	THREE.Mesh.call( this, geometry, material );

	this.geometry.computeVertexNormals();

	var vertices = geometry.attributes.position.array;

	for ( var iPerlin = ( ((segments*nbTiles)+1)*position.x*segments ) + position.y*segments, // index du début des données qui nous intéressent pour ce tile dans perlinData
						iPerlinLines = 0, // index pour les lignes
						iVertices = 2 ;
				iVertices < vertices.length  ;  iVertices += 3, iPerlin++, iPerlinLines++) {

					if (iPerlinLines == segments + 1) {
						iPerlin = iPerlin - 1 - segments + ((segments*nbTiles)+1) ;
						iPerlinLines = 0; // reset de l'index ligne
					}

					vertices[iVertices] = perlinData[iPerlin];

	}

	this.rotation.x = -Math.PI / 2;
	this.position.y = 0;
	this.position.z = size * position.x + size/2 ;
	this.position.x = size * position.y + size/2;

	for ( var i = 0, j = 2 ; i < vertices.length ; i ++, j += 3  ) {
		if (vertices[j] + 1 <= waterLevel) {
	  	vertices[j] = waterLevel - 1;
	 	}
	}

	debug("FMFTerrainTile finalPosition", this.position)

};

THREE.FMFTerrainTile.prototype = Object.create( THREE.Mesh.prototype );
THREE.FMFTerrainTile.prototype.constructor = THREE.FMFTerrainTile;

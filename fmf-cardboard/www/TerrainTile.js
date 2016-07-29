/**
 * @author marcelfallier
 */

THREE.TerrainTile = function ( perlinData, nbTiles, size, segments, terrainColor, position ) {

	console.log("TerrainTile # perlinData->",perlinData," nbTiles->",nbTiles," size->",size," segments->",segments," terrainColor->",terrainColor," position->",position);

	this.perlinData = perlinData;

	var geometry = new THREE.PlaneBufferGeometry( size, size, parseInt(segments), parseInt(segments));
	var material = new THREE.MeshLambertMaterial({color : Math.random() * 0xffffff, wireframe:true });

	THREE.Mesh.call( this, geometry, material );

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

	console.log("TerrainTile finalPosition", this.position)

	//
	//
	// for ( var i = 0, j = 2 ; i < vertices.length ; i ++, j += 3  ) {
	// 	vertices[j] = perlinData[i] * 1 - 100;
	// 	// vertices[j] = i/5;
	//
	// 	if (vertices[j] > yMax) {
	// 		yMax = vertices[j];
	// 	}
	// 	if (vertices[j] <= yMin) {
	// 		yMin = vertices[j];
	// 	}
	// }


};

THREE.TerrainTile.prototype = Object.create( THREE.Mesh.prototype );
THREE.TerrainTile.prototype.constructor = THREE.TerrainTile;

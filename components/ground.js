/* global AFRAME, THREE */

/**
 * Loads and setup ground model.
 */
AFRAME.registerComponent('ground', {
  init: function () {
    var dataLoader;
    var object3D = this.el.object3D;

    var TEX_SCALE = 60.0;
    new THREE.TextureLoader().load(
      'textures/geodata_map.jpg', function(textureM) {
        textureM.wrapS = THREE.RepeatWrapping;
				textureM.wrapT = THREE.RepeatWrapping;
        textureM.repeat.set(TEX_SCALE, TEX_SCALE);

        // load the heightmap we created as a texture
        new THREE.TextureLoader().load(
          'textures/geodata_topo.jpg', function(texture1) {
            texture1.wrapS = THREE.RepeatWrapping;
    				texture1.wrapT = THREE.RepeatWrapping;
            texture1.repeat.set(TEX_SCALE, TEX_SCALE);

            // the following configuration defines how the terrain is rendered
            var terrainShader = THREE.ShaderTerrain[ "terrain" ];
            var uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);

            // the displacement determines the height of a vector, mapped to
            // the heightmap
            uniformsTerrain[ "tDisplacement" ].value = texture1;
            uniformsTerrain[ "uDisplacementScale" ].value = 1.6;

            // add and scale the normal texture
            uniformsTerrain[ "tNormal" ].value = textureM;
            uniformsTerrain[ "tDiffuse1" ].value = textureM;
            uniformsTerrain[ "tDetail" ].value = textureM;
            uniformsTerrain[ "uNormalScale" ].value = 20;
            uniformsTerrain[ "enableDiffuse1" ].value = true;
            uniformsTerrain[ "enableDiffuse2" ].value = true;
            uniformsTerrain[ "enableSpecular" ].value = true;

            // diffuse is based on the light reflection
            uniformsTerrain[ "uDiffuseColor" ].value.setHex(0xffffff);
            uniformsTerrain[ "uSpecularColor" ].value.setHex(0xff0000);
            // is the base color of the terrain
            uniformsTerrain[ "uAmbientColor" ].value.setHex(0xffffff);

            // how shiny is the terrain
            uniformsTerrain[ "uShininess" ].value = 0;

            // handles light reflection
            uniformsTerrain[ "uRepeatOverlay" ].value.set(6, 6);

            // configure the material that reflects our terrain
            var material = new THREE.ShaderMaterial({
                uniforms:uniformsTerrain,
                vertexShader:terrainShader.vertexShader,
                fragmentShader:terrainShader.fragmentShader,
                wireframe:false,
                lights:true,
                fog:false
                // side: THREE.DoubleSide,
            });

            // we use a plane to render as terrain
            // we use a plane to render as terrain
            HeightmapRes = 128;
            var geometry = new THREE.PlaneGeometry(426, 300, HeightmapRes, HeightmapRes);
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            // create a 3D object to add
            var terrain = new THREE.Mesh(geometry, material);
            terrain.rotation.x = -Math.PI / 2;
            terrain.position.set(0, -5, 0);
            object3D.add( terrain );
        });
    });


  }
}); // -registerComponent

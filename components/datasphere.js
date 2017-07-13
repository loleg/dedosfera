/* global AFRAME, THREE */

/**
 * Loads and setup ground model.
 */
AFRAME.registerComponent('datasphere', {

  createSpheres: function() {
    var self = this;
    var object3D = this.el.object3D;
    var oasidata = this.oasidata;
    if (!oasidata) console.warn('Missing oasidata!');
    var i = 0;
    var colors = [ 0x62A9FF, 0x03F3AB, 0xDFE32D, 0xFFA4FF, 0xBEFEEB, 0x2FAACE ];
    Object.keys(oasidata).forEach(function(key) {
      var datastream = oasidata[key].datastream;
      // Set up a blanket around our ground
      var geometry = new THREE.SphereGeometry(1, 64, 64);
      var material = new THREE.MeshPhysicalMaterial( {
        map: null,
        color: colors[i],
        metalness: 0.1,
        roughness: 0.5,
        opacity: 0.4,
        transparent: true,
        side: 2,
        shading: THREE.SmoothShading,
        envMapIntensity: 5,
        premultipliedAlpha: true
      } );
      // Create geometry and add to scene
      var sphere = new THREE.Mesh(geometry, material);
      sphere.position.set((i*5) - 5,1,-10);
      self.messVertices( sphere, datastream, 4 );
      object3D.add(sphere);
      console.log(key);
      i++;
    });
  },

  loadData: function() {
    // Configure the data loader
    var DATA_URL = 'data/oasi_5year.json';
    if (this.dataLoader) { return; }
    dataLoader = this.dataLoader = new THREE.FileLoader();
    dataLoader.crossOrigin = '';

    var self = this,
        dataLen = null,
        oasidata = {};

    // Parse the data stream
    dataLoader.load(DATA_URL, function(text) {
      var oasi_5year = JSON.parse(text);
      for (var dtype in oasi_5year) {
        oasidata[dtype] = { locs: [], datastream: [] };
        for (var key in oasi_5year[dtype]) {
          var record = {
            'recs': [],
            'name': key,
            'symb': oasi_5year[dtype][key].resolution,
            'max': 0, 'min': 999999999
          };
          dd = oasi_5year[dtype][key].locations[0].data;
          for (var i = 0; i < dd.length; i++) {
            var ddr = dd[i];
            var val = ddr.values[0].value;
            if (isNaN(val)) continue;
            record.recs.push({
              'year': ddr.date.split('-')[0] +
                      ddr.date.split('-')[1],
              'val': val
            });
            if (val > record.max) record.max = val;
            if (val < record.min) record.min = val;
          }
          if (dataLen === null) dataLen = dd.length;
          if (dataLen !== dd.length) console.warn('Mismatched data');
          oasidata[dtype].locs.push(record);
          record.recs.forEach(function(r) {
            oasidata[dtype].datastream.push((r.val - record.min)/(record.max - record.min));
          });
        } // -for key
      } // -for dtype
      // console.log(datastream);

      self.oasidata = oasidata;
      self.createSpheres();
    });
  }, // -loadData

  messVertices: function( sphere, datastream, VERT_SCALE ) {
    // Mess with a sphere's vertices
    var i = 0;
    VERT_SCALE = VERT_SCALE || 10;
    sphere.geometry.vertices.forEach(function(v) {

      // Apply smoothing
      // if (datastream[i] <= 0) datastream[i] = 0;
      // if (i > 0) datastream[i] = (
      //     ((datastream[i-1] + datastream[i]) / 2) +
      //     ((datastream[i+1] + datastream[i]) / 2)
      //   )/2;

      v.x *= 1 + datastream[i] / VERT_SCALE;
      v.y *= 1 + datastream[i] / VERT_SCALE;
      v.z *= 1 + datastream[i] / VERT_SCALE;
      i++;
      if (i > datastream.length-1) i = 0;
    });
  }, // -messVertices

  init: function () {
    var dataLoader;

    // TODO: promises
    // this.loadData().then(function(datastream) {
    //   this.messVertices( sphere, datastream );
    //   object3D.add(sphere);
    // });
    this.loadData();

  } // -init

}); // -registerComponent

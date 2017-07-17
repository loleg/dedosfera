# dedosfera

An experiment created at the [Adventures in Data Visualization 2017](https://www.maind.supsi.ch/workshops/2017/2017-03-08-adventures-in-data-visualization-2017.html) workshop. 

### Overview

In this demonstration, a texture mapped and displaced ground visualises the terrain of the Canton of Tessin using geodata.

Ahead of the viewer, three "dataspheres" show the shape of the average patterns of traffic (blue), noise levels (green) and temperature (yellow) measurements averaged across several locations in Tessin during 2016.

Click on the download button in the corner of the screen to get an STL file of the dataspheres for 3D printing.

For some background on the project, please see this [forum post](https://forum.schoolofdata.ch/t/10-7-adv17-virtual-reality-workshop/245/6).

### Techniques

[A-Frame](https://aframe.io) is used for the overall VR-capable interface. Several [THREE.js](https://threejs.org/) components load the data and create custom geometries.

### Sources

Geodata: [Swisstopo](http://geo.admin.ch), Measurements: [OASI](http://www.oasi.ti.ch/web/dati/traffico.html)

### License

This project is open source under the [MIT License](LICENSE)

/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

let viewer = null;
let meshes = [];


function init(urn) {

  const options = {
    env: 'AutodeskProduction',
    accessToken: _access_token,
    isAEC: true
  };

  Autodesk.Viewing.Initializer(options, () => {

    const div = document.getElementById('forgeViewer');

    const config = { extensions: ["Autodesk.Viewing.Wireframes", 'Autodesk.DocumentBrowser'] };

    viewer = new Autodesk.Viewing.Private.GuiViewer3D(div, config);
    viewer.start();
    viewer.setTheme("light-theme");
    Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) => {
      var viewables = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, viewables).then( onLoadFinished );
    });
  });

  function onLoadFinished() {

  }
}

function addTextGeometry(text){
  let color = document.getElementById("head").value;

  meshes.map((m) => {
    viewer.overlays.removeMesh(m, "TextGeometryScene");
  })

  meshes = [];

  //First we create the TextGeometry
  var textGeo = new THREE.TextGeometry( text, {
      font: "monaco",
      size: 25,
      height: 0,
      curveSegments: 6,
  });

  //Here we compute the boundingbox as it's not done by default
  textGeo.computeBoundingBox();

  //Here we define the material for the geometry
  var textMaterial = new THREE.MeshBasicMaterial( { specular: 0xffffff } );

  textMaterial.color.set(color);

  //Here we create the mesh with TextGeometry and material defined previously
  let textMesh = new THREE.Mesh( textGeo, textMaterial );

  //Then, we set its position
  textMesh.position.x = -65;
  textMesh.position.y = -10;
  textMesh.position.z = 5;

  //and enable for shadows
  textMesh.castShadow = true;
  textMesh.receiveShadow = true;

  meshes.push(textMesh);

  //Now we just need to add on a custom scene on viewer
  if (!viewer.overlays.hasScene("TextGeometryScene")) {
      viewer.overlays.addScene("TextGeometryScene");
  }
  viewer.overlays.addMesh(textMesh, "TextGeometryScene");
  viewer.impl.sceneUpdated(true);

  scaleText(document.getElementById("slider").value);
}

function scaleText(value){
  for(var i =0; i< meshes.length; i++){
    meshes[i].scale.set(value,value,value);
  };
}

function changeColor(event){
  for(var i =0; i< meshes.length; i++){
    meshes[i].material.color.set( event.target.value );
  };
}

function lookAtMe(){
  for(var i =0; i< meshes.length; i++){
    meshes[i].quaternion.copy(viewer.getCamera().quaternion);
  };
}
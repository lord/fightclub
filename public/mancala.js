$(function() {
  // var updateState = function() {
  //   $.ajax({
  //     url: document.location.pathname + '/json',
  //     success: function(state) {
  //       $('body').text(state);
  //       setTimeout(updateState, 500);
  //     }
  //   });
  // }
  // updateState();

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var cubes = [];

  for(var i = 0; i <= 13; i++) {
    // var geometry = new THREE.CubeGeometry(1,1,1);
    // var material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture('/fur.jpg') } )
    // var cube = new THREE.Mesh( geometry, material );
    // cube.position.set(1.5,0,0);
    // scene.add( cube );
    // cubes.push(cube);
  }

  var geometry = new THREE.CubeGeometry(1,1,1);
  var material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture('/fur.jpg') } )
  var cube = new THREE.Mesh( geometry, material );
  cube.position.set(1.5,0,0);
  scene.add( cube );

  var light = new THREE.PointLight(0xffffff);
  light.position.set(10, 50, 130);
  scene.add(light);

  var light = new THREE.AmbientLight( 0x202020 ); // soft white light
  scene.add( light );

  var loader = new THREE.JSONLoader();

  var monkey;
  var createMesh = function(geometry, materials) {
    var material = new THREE.MeshFaceMaterial(materials);
    var zmesh = new THREE.Mesh(geometry, material);
    zmesh.position.set(-1.5,0,0);
    zmesh.scale.set(0.5,0.5,0.5);
    zmesh.overdraw = true;
    monkey = zmesh;
    scene.add(zmesh);
  };

  loader.load("/monkey.js", createMesh);

  camera.position.z = 5;

  canvas = renderer.domElement;
  canvas.addEventListener("mousemove",mousemove);
  canvas.addEventListener("mousedown",mousedown);
  canvas.addEventListener("mouseup",mouseup);
  var draggable = false;
  var lastX = 0;
  var lastY = 0;

  function mousemove(e){
    mouseX = e.layerX - canvas.offsetLeft;
    mouseY = e.layerY - canvas.offsetTop;

    if (draggable) {
      monkey.rotation.x += (mouseY - lastY) * 0.005;
      monkey.rotation.y += (mouseX - lastX) * 0.005;
      cube.rotation.x += (mouseY - lastY) * 0.005;
      cube.rotation.y += (mouseX - lastX) * 0.005;
    }

    lastX = mouseX;
    lastY = mouseY;
  }

  function mousedown(e){
    draggable = true;
    lastX = e.layerX - canvas.offsetLeft;
    lastY = e.layerY - canvas.offsetTop;
  }

  function mouseup(){
    draggable = false;
  }

  function render() {
    requestAnimationFrame(render);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // if (monkey) {
    //   monkey.rotation.x += 0.01;
    //   monkey.rotation.y += 0.01;
    // }
    renderer.render( scene, camera );
  }

  render();
});
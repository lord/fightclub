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
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 10, 100000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xfdfdfd, 1);
  renderer.shadowMapEnabled = true;

  document.body.appendChild( renderer.domElement );

  var controls = new THREE.OrbitControls( camera );

  var cubes = [];

  for(var i = 0; i <= 13; i++) {
    if (i != 6 && i != 13) {
      var map = {
        0: [-1,1], 1: [-1,2], 2: [-1,3], 3: [-1,4], 4: [-1,5], 5: [-1,6],
        7: [1,6], 8: [1,5], 9: [1,4], 10: [1,3], 11: [1,2], 12: [1,1]
      };
      var geometry = new THREE.CubeGeometry(300,100,300);
      var material = new THREE.MeshLambertMaterial( { color: 0xffffff } )
      var cube = new THREE.Mesh( geometry, material );
      cube.position.set(map[i][1]*800 - 2800,50,map[i][0]*400);
      cube.castShadow = true;
      scene.add( cube );
      cubes.push(cube);
    }
  }

  var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10000,10000,0),
    new THREE.MeshPhongMaterial( { color: 0x000000, emissive: 0xdddddd } )
  );
  floor.receiveShadow = true;
  floor.position.set(0,-8,0);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);


  var canvas1 = document.createElement('canvas');
  canvas1.width = 1000;
  canvas1.height = 1000;
  var context1 = canvas1.getContext('2d');
  context1.font = "Bold 400px Helvetica";
  context1.fillStyle = "rgba(255,0,0,0.95)";
  context1.fillText('50', 0, 300);

  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1)
  texture1.needsUpdate = true;

  var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
  material1.transparent = true;

  var mesh1 = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    material1
  );
  mesh1.position.set(3500,0,600);
  mesh1.rotation.x = -Math.PI / 2;
  scene.add( mesh1 );

  var canvas1 = document.createElement('canvas');
  canvas1.width = 1000;
  canvas1.height = 1000;
  var context1 = canvas1.getContext('2d');
  context1.font = "Bold 400px Helvetica";
  context1.fillStyle = "rgba(0,0,255,0.95)";
  context1.fillText('50', 0, 300);

  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1)
  texture1.needsUpdate = true;

  var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
  material1.transparent = true;

  var mesh1 = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    material1
  );
  mesh1.position.set(-2400,0,600);
  mesh1.rotation.x = -Math.PI / 2;
  scene.add( mesh1 );

  // var geometry = new THREE.CubeGeometry(1,1,1);
  // var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } )
  // var cube = new THREE.Mesh( geometry, material );
  // cube.position.set(1.5,0,0);
  // scene.add( cube );

  var setLightPosition = function(light, angle, distance) {
    var x = Math.sin(angle) * distance;
    var z = Math.cos(angle) * distance
    light.position.set(x, 1100, z);
  };
  var light = new THREE.DirectionalLight( 0xcccccc, 1 );
  var light_angle = 1;
  var light_distance = 1700;
  setLightPosition(light, light_angle, light_distance);
  // light.position.set( 1600, 1100, 600 );
  light.shadowDarkness = 0.3;
  light.castShadow = true;
  // light.shadowCameraVisible = true;
  var d = 3000;

  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;
  light.shadowMapWidth = 4024;
  light.shadowMapHeight = 4024;
  scene.add(light);

  var ambientLight = new THREE.AmbientLight( 0x202020 ); // soft white light
  scene.add( ambientLight );

  camera.position.z = 3000;

  function render() {
    requestAnimationFrame(render);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // if (monkey) {
    //   monkey.rotation.x += 0.01;
    //   monkey.rotation.y += 0.01;
    // }
    // camera.position.y += 0.01;
    // camera.rotation.x -= 0.001;
    light_angle += 0.0002;
    setLightPosition(light, light_angle, light_distance);

    renderer.render( scene, camera );
  }

  render();
});
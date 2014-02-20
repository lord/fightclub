$(function() {
  var game_id = $('body').data('game-id');
  var game_started = false;
  var controls;
  $('.player').click(function() {
    $(this).focus();
  });
  $('.random-player').click(function() {
    startRandom($(this).data('player-id'));
  });
  var updateState = function() {
    $.ajax({
      url: '/mancala/games/' + game_id + '/json',
      success: function(state) {
        if (game_started) {
          setSeeds(0, state['board'][0]);
          setSeeds(1, state['board'][1]);
          setSeeds(2, state['board'][2]);
          setSeeds(3, state['board'][3]);
          setSeeds(4, state['board'][4]);
          setSeeds(5, state['board'][5]);
          setScore(player0ScoreCanvas.getContext('2d'), player0ScoreMesh, state['board'][6], 'rgba(0,0,255,0.95)', 'left');
          setSeeds(7, state['board'][7]);
          setSeeds(8, state['board'][8]);
          setSeeds(9, state['board'][9]);
          setSeeds(10, state['board'][10]);
          setSeeds(11, state['board'][11]);
          setSeeds(12, state['board'][12]);
          setScore(player1ScoreCanvas.getContext('2d'), player1ScoreMesh, state['board'][13], 'rgba(255,0,0,0.95)', 'right');
        } else if (state['status'][0] == true && state['status'][1] == true) {
          game_started = true;
          controls = new THREE.OrbitControls( camera );
          $('.player').hide();
        } else if (state['status'][0] == true) {
          $('#player0').text('Player 0 Ready!');
        } else if (state['status'][1] == true) {
          $('#player1').text('Player 1 Ready!');
        }
        setTimeout(updateState, 300);
      }
    });
  }
  updateState();


  var startRandom = function(playerID) {
    $.ajax({
      url:'/mancala/status',
      data: { player_id: playerID },
      success: function(state) {
        if (state === 'waiting') {
          setTimeout(startRandom, 400, playerID);
          return true;
        }
        else if (state === 'win' || state === 'lose') {
          console.log('random player stopped');
          return true;
        }
        houses = state.split(' ');
        var move = 0;
        while (houses[move] == '0') {
          move = Math.floor(Math.random()*6)
        }
        $.ajax({
          url:'/mancala/move',
          data: { player_id: playerID, house: move }
        });
        setTimeout(startRandom, 600, playerID);
      }
    });
  };

  ///////////////////////////////
  // BASIC 3D SETUP
  ///////////////////////////////
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 100000);
  camera.position.z = 5000;
  camera.position.y = 3000;
  camera.rotation.x = -0.54042;
          // controls = new THREE.OrbitControls( camera );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xdedede, 1);
  renderer.shadowMapEnabled = true;

  document.body.appendChild( renderer.domElement );


  ///////////////////////////////
  // CUBE CODE
  ///////////////////////////////
  var cubes = [];
  var cube_location_map = {};

  for(var i = 0; i <= 13; i++) {
    if (i != 6 && i != 13) {
      var map = {
        0: [-1,1], 1: [-1,2], 2: [-1,3], 3: [-1,4], 4: [-1,5], 5: [-1,6],
        7: [1,6], 8: [1,5], 9: [1,4], 10: [1,3], 11: [1,2], 12: [1,1]
      };
      var geometry = new THREE.CubeGeometry(300,100,300);
      var grayMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x777777, shininess: 10, specular: 0x333333 } );
      var cubeTopMaterial = new THREE.MeshBasicMaterial( { color: 0xff3333 } );
      if (i < 6) {
        cubeTopMaterial = new THREE.MeshBasicMaterial( { color: 0x3333ff } );
      }
      var cubeMaterialArray = [
        grayMaterial,
        grayMaterial,
        cubeTopMaterial,
        grayMaterial,
        grayMaterial,
        grayMaterial,
      ];
      var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
      var cube = new THREE.Mesh( geometry, cubeMaterials );
      cube.position.set(map[i][1]*800 - 2800,50,map[i][0]*400);
      cube_location_map[i] = [map[i][1]*800 - 2800,50,map[i][0]*400]
      cube.castShadow = true;
      cube.receiveShadow = true;
      scene.add( cube );
      cubes.push(cube);
    }
  }

  var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10000,10000,0),
    new THREE.MeshPhongMaterial( { color: 0x000000, emissive: 0x999999, shininess: 0 } )
  );
  floor.receiveShadow = true;
  floor.position.set(0,-8,0);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  ///////////////////////////////
  // SCORE DISPLAY CODE
  ///////////////////////////////
  var setScore = function(context, mesh, score, color, align) {
    context.clearRect(0,0,1000,1000);
    context.font = "Bold 400px Helvetica";
    context.fillStyle = color;
    context.textAlign = align;
    if (align === 'right') {
      context.fillText(score.toString(), 1000, 340);
    }
    else {
      context.fillText(score.toString(), 0, 340);
    }
    mesh.material.map.needsUpdate = true;
    return true;
  };
  function newCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };
  function materialFromCanvas(canvas) {
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
    material.transparent = true;

    return material;
  }
  var player0ScoreCanvas = newCanvas(1000,1000);
  var context = player0ScoreCanvas.getContext('2d');

  var player0ScoreMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    materialFromCanvas(player0ScoreCanvas)
  );
  player0ScoreMesh.position.set(3500,0,600);
  player0ScoreMesh.rotation.x = -Math.PI / 2;
  scene.add( player0ScoreMesh );

  setScore(context, player0ScoreMesh, '0', 'rgba(0,0,255,0.95)', 'left');

  var player1ScoreCanvas = newCanvas(1000,1000);
  var context1 = player1ScoreCanvas.getContext('2d');

  var player1ScoreMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    materialFromCanvas(player1ScoreCanvas)
  );
  player1ScoreMesh.position.set(-3500,0,600);
  player1ScoreMesh.rotation.x = -Math.PI / 2;
  scene.add( player1ScoreMesh );

  setScore(context1, player1ScoreMesh, '0', 'rgba(255,0,0,0.95)', 'right');

  // var geometry = new THREE.CubeGeometry(1,1,1);
  // var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } )
  // var cube = new THREE.Mesh( geometry, material );
  // cube.position.set(1.5,0,0);
  // scene.add( cube );

  ///////////////////////////////
  // SEED DISPLAY CODE
  ///////////////////////////////

  // Array of arrays, key is the houseID the array of seeds are above
  var seeds = Array();

  function setSeeds(houseID, seedCount) {
    var location = cube_location_map[houseID];
    var x = location[0];
    var y = location[1];
    var z = location[2];
    houseID = parseInt(houseID);
    seedCount = parseInt(seedCount);
    var seedMaterial = new THREE.MeshPhongMaterial( {
      color: 0xffffff,
      emissive: 0x888888,
      shininess: 10,
      specular: 0x000000
    } );

    if (seeds[houseID] !== undefined) {
      for(seed in seeds[houseID]) {
        scene.remove(seeds[houseID][seed]);
      }
    }

    seeds[houseID] = Array();

    for(var i = 0; i < seedCount; i++) {
      var obj = new THREE.Mesh(
        new THREE.CubeGeometry(75, 75, 75),
        seedMaterial
      );
      obj.position.set(x, y + 200 + 150 * i, z);
      obj.castShadow = true;
      scene.add(obj);
      seeds[houseID].push(obj);
    }
  };



  ///////////////////////////////
  // LIGHTING
  ///////////////////////////////
  var setLightPosition = function(light, angle, distance) {
    var x = Math.sin(angle) * distance;
    var z = Math.cos(angle) * distance
    light.position.set(x, 1100, z);
  };
  var light = new THREE.DirectionalLight( 0x666666, 1 );
  var light_angle = -1;
  var light_distance = 1700;
  setLightPosition(light, light_angle, light_distance);
  // light.position.set( 1600, 1100, 600 );
  light.shadowDarkness = 0.3;
  light.castShadow = true;
  // light.shadowCameraVisible = true;
  light.shadowCameraLeft = light.shadowCameraBottom = -3000;
  light.shadowCameraRight = light.shadowCameraTop = 3000;
  light.shadowMapWidth = light.shadowMapHeight = 4024;
  scene.add(light);

  var ambientLight = new THREE.AmbientLight( 0x444444 ); // soft white light
  scene.add( ambientLight );


  ///////////////////////////////
  // RENDER LOOP
  ///////////////////////////////
  function render() {
    requestAnimationFrame(render);
    renderer.render( scene, camera );
  }

  render();
});
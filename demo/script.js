var scene;
var camera;
var renderer;
var clock;

// フィールド関連
var cube, meshFloor, mesh;
var cubeWidth = 1;
var cubeHeight = 1;
var gun;

// 光源関連
var ambientLight, light;

// テクスチャ関連
var crate, crateTexture, crateNormalMap, crateBumpMap;


var keyboard = {};
var player = { 
    height: 1.8, 
    speed: 0.2, 
    turnSpeed: Math.PI*0.02, 
    canShoot:0
};

// モデルリスト
var models = {
    uzi: {
		obj:"models/uziGold.obj",
		mtl:"models/uziGold.mtl",
		mesh: null,
		castShadow:false
	}, 
	tent: {
		obj:"models/Tent_Poles_01.obj",
		mtl:"models/Tent_Poles_01.mtl",
		mesh: null
	},
	campfire: {
		obj:"models/Campfire_01.obj",
		mtl:"models/Campfire_01.mtl",
		mesh: null
	},
	pirateship: {
		obj:"models/Pirateship.obj",
		mtl:"models/Pirateship.mtl",
		mesh: null
	}
};

var meshes = [];

var bullets = [];

var USE_WIREFRAME = false;

// ------------------------------------

window.onload = init;

function init(){
    
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Move the camera to 0,0,-5 (the Y axis is "up")
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0, player.height, 0));
    
    createStage();
    createLights();

    function createStage() {
        var cubeGeo = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeWidth);
        var cubeMat = new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME});



        cube = new THREE.Mesh(cubeGeo, cubeMat);

        cube.position.y += 1;
        cube.castShadow = true;
        scene.add(cube);

        
        var meshFloorGeo = new THREE.PlaneGeometry(10,10, 10,10);
        var meshFloorMat = new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})

        meshFloor = new THREE.Mesh(meshFloorGeo, meshFloorMat);

        // 90度回転させる
        meshFloor.rotation.x -= Math.PI / 2;
        meshFloor.receiveShadow = true;
        scene.add(meshFloor);

        // // テクスチャのローディング
        // var textureLoader = new THREE.TextureLoader();
        // crateTexture = textureLoader.load("img/crate0_diffuse.png");
        // crateBumpMap = textureLoader.load("img/crate0_bump.png");
        // crateNormalMap = textureLoader.load("img/crate0_normal.png");

        // var crateGeo = new THREE.BoxGeometry(3, 3, 3);
        // var crateMat = new THREE.MeshBasicMaterial({
        //     color:0xffffff,
            
		// 	map:crateTexture,
		// 	bumpMap:crateBumpMap,
		// 	normalMap:crateNormalMap
        // });

        // crate = new THREE.Mesh(crateGeo, crateMat);
        // scene.add(crate);
        // crate.position.set(2.5, 3/2, 2.5);
        // crate.receiveShadow = true;
        // crate.castShadow = true;

        var mtlLoader = new THREE.MTLLoader();
	    mtlLoader.load("models/uziGold.mtl", function(materials){
		
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            
            objLoader.load("models/uziGold.obj", function(mesh){
            
                mesh.traverse(function(node){
                    if( node instanceof THREE.Mesh ){
                        node.castShadow = false;
                        node.receiveShadow = false;
                    }
                });

					 gun = mesh;
					 mesh.position.set(0,2,0);
	             mesh.scale.set(10,10,10);
                scene.add(mesh);
                
                
            });
		
	});

    }


    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // レンダラーの影の生成をオンにする
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    


    var stage = document.getElementById("stage");
    // rendererのdomElementって何？
    stage.appendChild(renderer.domElement);
    
    window.addEventListener('resize', onWindowResize, false);
	
	animate();
}



function createLights() {
    
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    
    light = new THREE.SpotLight(0xffffff, 0.8, 18);
    light.position.set(-3,6,-3);
    light.castShadow = true;
    
   //  // これの詳しい使用を調べる
   //  light.shadow.camera.near = 0.1;
   //  light.shadow.camera.far = 25;

    scene.add(light);
}


function animate(){
    requestAnimationFrame(animate); 
    
    var time = Date.now() * 0.0005;
	var delta = clock.getDelta();
	
	cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;

    for (var index=0; index<bullets.length; index+=1) {
		if( bullets[index] === undefined ) continue;
		if( bullets[index].alive == false ){
			bullets.splice(index,1);
			continue;
		}
		
		bullets[index].position.add(bullets[index].velocity);
	}
    
    if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		// Redirect motion by 90 degrees
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }
    
    // Keyboard turn inputs
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
    }

    if(keyboard[32] && player.canShoot <= 0){ // spacebar key
		// creates a bullet as a Mesh object
		var bullet = new THREE.Mesh(
			new THREE.SphereGeometry(0.05,8,8),
			new THREE.MeshBasicMaterial({color:0xffffff})
		);
		// this is silly.
		// var bullet = models.pirateship.mesh.clone();
		
		// position the bullet to come from the player's weapon
		bullet.position.set(
			gun.position.x,
			gun.position.y + 0.15,
			gun.position.z
		);
		
		// set the velocity of the bullet
		bullet.velocity = new THREE.Vector3(
			-Math.sin(camera.rotation.y),
			0,
			Math.cos(camera.rotation.y)
		);
		
		// after 1000ms, set alive to false and remove from scene
		// setting alive to false flags our update code to remove
		// the bullet from the bullets array
		bullet.alive = true;
		setTimeout(function(){
			bullet.alive = false;
			scene.remove(bullet);
		}, 1000);
		
		// add to scene, array, and set the delay to 10 frames
		bullets.push(bullet);
		scene.add(bullet);
		player.canShoot = 10;
	}
	if(player.canShoot > 0) player.canShoot -= 1;
    
    gun.position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
		camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
	);
	gun.rotation.set(
		camera.rotation.x,
		camera.rotation.y - Math.PI,
		camera.rotation.z
	);
	
	renderer.render(scene, camera);
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// キー入力に応じてflagを立てる
function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
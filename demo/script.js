var scene;
var camera;
var renderer;
var cube;
var meshFloor;

var ambientLight;
var light;

// テクスチャ関連
var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { 
    height: 1.8, 
    speed: 0.2, 
    turnSpeed: Math.PI*0.02 
};

var USE_WIREFRAME = false;

var cubeWidth = 1;
var cubeHeight = 1;

window.onload = init;

function init(){
    
    scene = new THREE.Scene();
    
    
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

        // planeのパラメータは何？
        var meshFloorGeo = new THREE.PlaneGeometry(10,10, 10,10);
        var meshFloorMat = new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})

        meshFloor = new THREE.Mesh(meshFloorGeo, meshFloorMat);

        // 90度回転させる
        meshFloor.rotation.x -= Math.PI / 2;
        meshFloor.receiveShadow = true;
        scene.add(meshFloor);

        // // テクスチャの生成はマジで何もわからないので本を読む
        // var textureLoader = new THREE.TextureLoader();
        // crateTexture = textureLoader.load("img/crate0_diffuse.png");
        // crateBumpMap = textureLoader.load("img/crate0_bump.png");
        // crateNormalMap = textureLoader.load("img/crate0_normal.png");

        // var crateGeo = new THREE.BoxGeometry(3, 3, 3);
        // var crateMat = new THREE.MeshBasicMaterial({
        //     color:0xffffff,
            
        //     // こいつはどういうことだ...？
		// 	map:crateTexture,
		// 	bumpMap:crateBumpMap,
		// 	normalMap:crateNormalMap
        // });

        // crate = new THREE.Mesh(crateGeo, crateMat);
        // scene.add(crate);
        // crate.position.set(2.5, 3/2, 2.5);
        // crate.receiveShadow = true;
        // crate.castShadow = true;
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
    
    // これの詳しい使用を調べる
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;



    scene.add(light);
}


function animate(){
	requestAnimationFrame(animate); 
	
	cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    
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
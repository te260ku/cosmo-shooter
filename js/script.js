var cubeWidth = 40;
var cubeHeight = 25;

var camera;
var scene;
var renderer;

var controls;
var controlsEnabled = false;
var blocker = document.getElementById('blocker');

// window.addEventListener('load', init);
getPointerLock();
init();
animate();

function getPointerLock() {
    document.onclick = function () {
      stage.requestPointerLock();
    }
    document.addEventListener('pointerlockchange', lockChange, false); 
}

function lockChange() {
    if (document.pointerLockElement === stage) {
        blocker.style.display = "none";
        controls.enabled = true;
    } else {
        blocker.style.display = "";
        controls.enabled = false;
    }
}

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xcccccc, 0.0015);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var stage = document.getElementById("stage");
    // rendererのdomElementって何？
    stage.appendChild(renderer.domElement);

    // camaeraの設定
    // cameraの引数を確認しておく
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = 0;
    camera.position.y = 20;
    camera.position.z = 0;

    scene.add(camera);
    createStage();
    createLights();

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // リサイズ時に縦横比を維持する
    window.addEventListener('resize', onWindowResize, false);
}



function createLights() {
    var firstLight = new THREE.DirectionalLight(0xffffff);
    firstLight.position.set(1, 1, 1);
    scene.add(firstLight);
  
    var secondLight = new THREE.DirectionalLight(0xffffff, .5);
    secondLight.position.set(1, -1, -1);
    scene.add(secondLight);
  }
  

function createStage() {
    var cubeGeo = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeWidth);
    var cubeMat = new THREE.MeshPhongMaterial({
        color: 0x81cfe0, 
        // wireframe: true
    });
    var cube = new THREE.Mesh(cubeGeo, cubeMat);
    scene.add(cube);
    cube.position.y = cubeWidth / 2 - 20;
    cube.position.x = 0;
    cube.position.z = -50;

    var mapSize = 100;  

    createGround();

    function createGround() {
        var groundGeo = new THREE.PlaneGeometry(mapSize, mapSize);
        var groundMat = new THREE.MeshPhongMaterial({ color: 0xA0522D, side: THREE.DoubleSide});

        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.set(0, 1, 0);
        ground.rotation.x = degreesToRadians(90);
        scene.add(ground);
    }
}

// 角度の変換用
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
  
function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    
    render();
    // 定期的にレンダラーを更新する

    
    requestAnimationFrame(animate);

    
}

function render() {
    // これをやらないと何も見えない
    renderer.render(scene, camera);
}
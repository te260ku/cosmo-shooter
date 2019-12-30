

var keyboard = {};

var scene;
var camera;
var renderer;
var controls;
var emitter;

window.onload = init;

// var blocker = document.getElementById('blocker');
// blocker.addEventListener('click', function() {
//    blocker.style.display = "none";
// });

function init() {

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10000);
camera.position.set(0, 0, 1);
scene.add(camera);
renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
var stage = document.getElementById("stage");
stage.appendChild(renderer.domElement);

// controls = new THREE.OrbitControls(camera, renderer.domElement);
controls = new THREE.FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.1;
controls.movementSpeed = 0;
controls.noFly = true;
controls.lookVertical = true;
controls.constrainVertical = false;
// controls.verticalMin = 1.0;
// controls.verticalMax = 2.0;
// controls.lon = -150;
// controls.lat = 120;



var background = new THREE.Mesh(new THREE.SphereGeometry(1000, 90, 45), new THREE.MeshBasicMaterial({
  color: "gray",
  wireframe: true
}));
scene.add(background);

const axes = new THREE.AxisHelper(400);
scene.add(axes);

var weapon = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 5), new THREE.MeshBasicMaterial({
  color: 0x5555ff
}));
weapon.position.set(2, -1, -2.5);
camera.add(weapon);
emitter = new THREE.Object3D();
emitter.position.set(2, -1, -5);
camera.add(emitter);

render();
}


var plasmaBalls = [];
// window.addEventListener("keydown", onMouseDown);
var canShoot = true;

function onMouseDown() {
  let plasmaBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshBasicMaterial({
    color: "aqua"
  }));
  plasmaBall.position.copy(emitter.getWorldPosition()); // start position - the tip of the weapon
  plasmaBall.quaternion.copy(camera.quaternion); // apply camera's quaternion

  plasmaBall.alive = true;
  setTimeout(function(){
   plasmaBall.alive = false;
     scene.remove(plasmaBall);
   }, 1000);


  scene.add(plasmaBall);
  plasmaBalls.push(plasmaBall);
 
  canShoot = false;
  setTimeout(function() {
     canShoot = true;
  }, 1000);
}

var speed = 50;
var clock = new THREE.Clock();
var delta = 0;

var controlsFlag = false;

// 定義したその場で即実行される即時関数
function render() {
   // 弾丸の発射
   if (keyboard[32] && canShoot) {
      onMouseDown();
   }

   // controlsのオンオフ
   if (keyboard[87]) {
      if (!controlsFlag) {
         controls.enabled = true;
         controlsFlag = true;
         keyboard[87] = false;
      } else {
         controls.enabled = false;
         controlsFlag = false;
         keyboard[87] = false;
      }
      
   }
  requestAnimationFrame(render);
  delta = clock.getDelta();
  plasmaBalls.forEach(b => {
    b.translateZ(-speed * delta); // move along the local z-axis
  });

  controls.update(delta);
  renderer.render(scene, camera);
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

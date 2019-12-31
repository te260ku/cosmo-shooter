var scene;
var camera;
var renderer;
var controls;
var emitter;

var cube0;
var cube1;
var cube2;
var cubes = [];

var destroyFlag;

var keyboard = {};
var score = 0;

window.onload = init;

// var blocker = document.getElementById('blocker');
// blocker.addEventListener('click', function() {
//    blocker.style.display = "none";
// });

function init() {

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10000);
camera.position.set(0, 1, 1);
camera.lookAt(0, 0, 0);
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

ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);


var background = new THREE.Mesh(new THREE.SphereGeometry(1000, 90, 45), new THREE.MeshBasicMaterial({
  color: "gray",
  wireframe: true
}));
scene.add(background);

const axes = new THREE.AxisHelper(400);
axes.position.set(0, 0, 0);
scene.add(axes);


var weapon = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 5), new THREE.MeshBasicMaterial({
  color: 0x5555ff
}));
weapon.position.set(2, -1, -2.5);
// weapon.position.set(0, 0, -1.5);
camera.add(weapon);



// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.load("../demo/models/uziGold.mtl", function(materials){

//      materials.preload();
//      var objLoader = new THREE.OBJLoader();
//      objLoader.setMaterials(materials);
     
//      objLoader.load("../demo/models/uziGold.obj", function(mesh){
     
//          mesh.traverse(function(node){
//              if( node instanceof THREE.Mesh ){
//                  node.castShadow = false;
//                  node.receiveShadow = false;
//              }
//          });
//          mesh.rotation.ydegreesToRadians
//          mesh.scale.set(10,10,10);
//          mesh.position.set(2, -1, -2.5);
        
//          camera.add(mesh);
//      });

// });



emitter = new THREE.Object3D();
emitter.position.set(2, -1, -5);
camera.add(emitter);


// var cubeGeo = new THREE.BoxGeometry(1, 1, 1);
var cubeGeo = new THREE.SphereGeometry();
var cubeMat = new THREE.MeshPhongMaterial({color:0x5555ff, wireframe:false});
cube0 = new THREE.Mesh(cubeGeo, cubeMat);
cube0.position.set(10, 1, 0);

if (cube0.geometry.boundingSphere == null) { 
   cube0.geometry.computeBoundingSphere();
} 
//少しだけ小さめにする
cube0.geometry.boundingSphere.radius *= 1;
cube0.name = "cube-" + 0;
cubes.push(cube0);
scene.add(cube0);

cube1 = new THREE.Mesh(cubeGeo, cubeMat);
cube1.position.set(8, 5, 10);
if (cube1.geometry.boundingSphere == null) { 
   cube1.geometry.computeBoundingSphere();
} 
cube1.geometry.boundingSphere.radius *= 0.5;
cube1.name = "cube-" + 1;
cubes.push(cube1);
scene.add(cube1);

cube2 = new THREE.Mesh(cubeGeo, cubeMat);
cube2.position.set(12, 2, 10);
if (cube2.geometry.boundingSphere == null) { 
   cube2.geometry.computeBoundingSphere();
} 
cube2.geometry.boundingSphere.radius *= 0.5;
cube2.name = "cube-" + 2;
cubes.push(cube2);
scene.add(cube2);







render();
}



var plasmaBalls = [];
// window.addEventListener("keydown", onMouseDown);
var canShoot = true;

function onMouseDown() {
  let plasmaBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshBasicMaterial({
    color: "aqua"
  }));
  if (plasmaBall.geometry.BoundingSphere == null) { 
   plasmaBall.geometry.computeBoundingSphere();
   } 
   plasmaBall.geometry.boundingSphere.radius *= 0.8;
  plasmaBall.position.copy(emitter.getWorldPosition()); // start position - the tip of the weapon
  plasmaBall.quaternion.copy(camera.quaternion); // apply camera's quaternion

  plasmaBall.alive = true;
  setTimeout(function(){
   plasmaBall.alive = false;
     scene.remove(plasmaBall);
     plasmaBalls.shift();
   }, 5000);


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

//   var box1 = cube.geometry.boundingSphere.clone();
//   box1.applyMatrix4(cube.matrixWorld);


//   var allChildren = scene.children;

  plasmaBalls.forEach(b => {
     // ローカルのz軸向きに飛ばす
    b.translateZ(-speed * delta); 

    var targetBullet = b.geometry.boundingSphere.clone();
    targetBullet.applyMatrix4(b.matrixWorld);



  for (i=0; i<cubes.length; i++) {

   var targetCube = cubes[i].geometry.boundingSphere.clone();
   targetCube.applyMatrix4(cubes[i].matrixWorld);

   if (targetCube.intersectsSphere(targetBullet)) {
      score ++;
      console.log("hit");
      
      t = scene.getObjectByName(cubes[i].name);
      
      scene.remove(t);
      // t.visible = false;
      scene.remove(targetCube);
      cubes.splice(i, 1);
      // cubes[i] = "none"

      scene.remove(targetBullet);
      scene.remove(b);
      // break;
      // plasmaBalls.splice(i, 1);
   } 

  }
//   while (i<cubes.length) {
//    var targetCube = cubes[i].geometry.boundingSphere.clone();
//    targetCube.applyMatrix4(cube.matrixWorld);

//    if (targetCube.intersectsSphere(targetBullet)) {
//       score ++;
//       console.log("hit");
//       scene.remove(cube);
//       scene.remove(targetCube);
//       cubes.splice(i, 1);

//       scene.remove(targetBullet);
//       scene.remove(b);
//       break;
//       // plasmaBalls.splice(i, 1);
//    } 
//    i++;
//   }
  
      

    
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

function degreesToRadians(degrees) {
   return degrees * Math.PI / 180;
}
 
function radiansToDegrees(radians) {
   return radians * 180 / Math.PI;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

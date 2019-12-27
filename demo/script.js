var scene;
var camera;
var renderer;
var cube;

var cubeWidth = 1;
var cubeHeight = 1;

window.onload = init;

function init(){
    
	scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Move the camera to 0,0,-5 (the Y axis is "up")
	camera.position.set(0,0,-5);
	camera.lookAt(new THREE.Vector3(0,0,0));
    
    createStage();

    function createStage() {
        var cubeGeo = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeWidth);
        var cubeMat = new THREE.MeshBasicMaterial({
        color:0xff4444, 
        wireframe:true
        });

        cube = new THREE.Mesh(cubeGeo, cubeMat);
        scene.add(cube);
    }
    

	

    
	renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    var stage = document.getElementById("stage");
    // rendererのdomElementって何？
    stage.appendChild(renderer.domElement);
    
    window.addEventListener('resize', onWindowResize, false);
	
	animate();
}


function animate(){
	requestAnimationFrame(animate); 
	
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.02;
	
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
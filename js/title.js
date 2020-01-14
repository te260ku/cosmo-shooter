var startButton = document.getElementById("start-button");
startButton.addEventListener("click", onClick);

var bgmButton = document.getElementById("bgm-button");
bgmButton.addEventListener("click", bgmStart);



function onClick() {
   window.location.href = "main.html";
}



var bgmFlag = false;

function bgmStart() {
  if (!bgmFlag) {
    audio.play();
    bgmFlag = true;
  } else {
    audio.pause();
    bgmFlag = false;
  }
}

var audio = new Audio("../audio/op_bgm.mp3");
audio.loop = true;



(function() {

  
   var scene;
   var camera;
   var renderer;
   var width = window.innerWidth;
   var height = window.innerHeight;
   

   var particles;
   var loader;

   scene = new THREE.Scene();

   camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
   camera.position.set(100, 100, 100);
   camera.lookAt(scene.position);

   
   renderer = new THREE.WebGLRenderer({ antialias: true });
   renderer.setSize(width, height);
   renderer.setClearColor(0x000000);
   renderer.setPixelRatio(window.devicePixelRatio);
   document.getElementById('stage').appendChild(renderer.domElement);


   // テクスチャのロード
   loader = new THREE.TextureLoader();
   loader.load('../img/particle.png', function(texture) {
     createParticles(texture);
     render();
   });

   function createParticles(texture) {
     var particleGeo;
     var particleMat;
     var particleNum = 2000;

     particleGeo = new THREE.Geometry();
     for (i = 0; i < particleNum; i++) {
      particleGeo.vertices.push(
         new THREE.Vector3(

           // -100〜100の乱数
           Math.random() * 200 - 100,
           Math.random() * 200 - 100,
           Math.random() * 200 - 100
         )
       );
     }

     
     particleMat = new THREE.PointsMaterial({
       map: texture,
       size: 5, 
       blending: THREE.AdditiveBlending, 
       transparent: true,
       // 物体が重なった時に後ろにあるものを描画するかしないか 
       depthTest: false 
     });

     particles = new THREE.Points(particleGeo, particleMat);
     scene.add(particles);
   }

   function render() {
     requestAnimationFrame(render);
     particles.rotation.y += 0.001;
     renderer.render(scene, camera);
   }

 })();
// var controls;
class ThreeWorld{
 
    constructor(){
        //シーン、カメラ、レンダラーを生成
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight);
        this.camera.position.set(0.1, 0, 0);
        this.scene.add(this.camera);
 
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
 
        //canvasを作成
        const container = document.createElement('div');
        document.body.appendChild(container);
        container.appendChild(this.renderer.domElement);
 
        //球体の形状を生成
        const geometry = new THREE.SphereGeometry(100, 100, 100);
        geometry.scale(-1, 1, 1);
 
        //テクスチャ画像を読み込み
        const loader = new THREE.TextureLoader();
        const texture = loader.load('test.jpg');
 
        //球体のマテリアルを生成
        const material = new THREE.MeshBasicMaterial({
          map: texture
        });
 
        //球体を生成
        const sphere = new THREE.Mesh(geometry, material);
 
        this.scene.add(sphere);
 
        //OrbitControlsを初期化
        // const orbitControls = new OrbitControls(this.camera,this.renderer.domElement);
//         controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
//    controls.lookSpeed = 0.1;
//    controls.movementSpeed = 1;
//    controls.noFly = true;
//    controls.lookVertical = true;
//    controls.constrainVertical = false;
 
        this.render();
    }
 
    render() {
        requestAnimationFrame(this.render.bind(this));
        // controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
//===============================================================
// Window load
//===============================================================
window.addEventListener("load", function () {
   const threeWorld = new ThreeWorld();
});
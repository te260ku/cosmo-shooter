// プレイ画面の縦幅と横幅を指定
const width = window.innerWidth;
// const height = 580;
const height = window.innerHeight;
// タピオカのオブジェクトの大きさを指定
const sphere_width = 10;
const sphere_height = 10;
// タピオカの移動速度を指定
const min_speed = 1;
const max_speed = 2;
// クエリパラメータを取得する
const s = location.search;
// 取得したクエリパラメータを分割して数値だけを取り出す
const sphere_num = s.substring(1);

// 表示するタピオカを格納する配列
let tapiocas = [];
// スコアを格納する変数を宣言
var score = 0;
// 開始してからの経過時間を格納する変数を宣言
var PassSec;

// 使用する音声ファイルを指定
const audio = new Audio('audio/audio.mp3.mov');

// マウスをクリックした際に効果音が出るようにする
document.onclick = function() {
    audio.play();
};


function startShowing() {
    // カウンタのリセット
    PassSec = 0;
    // タイマーをセット(1000ms間隔)
    PassageID = setInterval('showPassage()', 1000);
}

function showPassage() {
    PassSec++;
    LeftTime = 30 - PassSec
    var msg = 'Left Time : ' + String(LeftTime) + ' sec';
    // 表示更新
    document.getElementById("time").innerHTML = msg;
}

function gameOver() {
    window.location.href = 'gameover.html';
}


// ページが読み込まれたらinit関数を実行
window.addEventListener('load', init);

function init() {
    // 30秒が経過したらgameOver関数を実行
    setTimeout(gameOver, 30000);
    // タイマーのカウントを開始する
    startShowing();

    // idからキャンバスの要素を取得する
    const canvas = document.querySelector('#myCanvas');

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });
    // レンダラーのサイズを指定する
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // 背景に使用する画像ファイルを指定して、背景として追加する
    // scene.background = new THREE.Color( 0xfaebd7 );
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('img/game_background.png');
    scene.background = bgTexture;

    // マウス座標管理用のベクトルを作成
    const mouse = new THREE.Vector2();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    // カメラの位置を指定
    camera.position.set(0, +300, +800);
    // カメラの視点を指定する
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    // タピオカのジオメトリを作成
    const sphere_geometry = new THREE.SphereGeometry(30, sphere_width, sphere_height);
    // タピオカのマテリアルを作成
    const sphere_material = new THREE.MeshStandardMaterial({ color: 0x323233 });

    // ユーザーが指定した個数に達するまでタピオカのオブジェクトを生成して、配列に追加する
    for (var i = 0; i < sphere_num; i++) {
        tapiocas.push(new THREE.Mesh(sphere_geometry, sphere_material));
    }
    // 配列内のタピオカモデルをすべてシーンに追加して表示されるようにする
    for (var i in tapiocas) {
        scene.add(tapiocas[i])
    }

    // 光源の作成
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // オブジェクトとマウスの交わりを検出するためのレイキャストを作成
    const raycaster = new THREE.Raycaster();
    // マウスをクリックしたときにhandleMouseMove関数を実行
    canvas.addEventListener('click', handleMouseMove);

    function handleMouseMove(event) {
        const element = event.currentTarget;
        // canvas要素上のXY座標
        const x = event.clientX - element.offsetLeft;
        const y = event.clientY - element.offsetTop;
        // canvas要素の幅・高さ
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        // -1〜+1の範囲で現在のマウス座標を登録する
        mouse.x = (x / w) * 2 - 1;
        mouse.y = -(y / h) * 2 + 1;
    }

    // リサイズイベント発生時に実行
    window.addEventListener('resize', onResize);

    function onResize() {
        // サイズを取得
        const width = window.innerWidth;
        const height = window.innerHeight;

        // レンダラーのサイズを調整する
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        // カメラのアスペクト比を正す
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }


    // タピオカの位置を格納するための配列
    // 以下の文献を参考に作成(***で囲った部分)
    // 【Three.js】複数のブロックを散らしてみる. (参照　2019, 7, 2). https://qiita.com/ut0n/items/4abc77ac670463f9b657

    // ***
    let x = [];
    let y = [];
    let z = [];
    let dx = [];
    let dy = [];
    let dz = [];
    const min_pos_x = -(Number(width) / 2);
    const max_pos_x = (Number(width) / 2);
    const min_pos_y = -(Number(height) / 2);
    const max_pos_y = (Number(height) / 2);
    const min_pos_z = -(Number(height) / 2);
    const max_pos_z = (Number(height) / 2);

    // すべてのタピオカオブジェクトの挙動をランダムで生成して、配列にそれぞれを格納する
    for (var i = 0; i < sphere_num; i++) {
        x.push(Math.floor(Math.random() * (max_pos_x + 1 - min_pos_x)) + min_pos_x);
        y.push(Math.floor(Math.random() * (max_pos_y + 1 - min_pos_y)) + min_pos_y);
        z.push(Math.floor(Math.random() * (max_pos_z + 1 - min_pos_z)) + min_pos_z);
        dx.push(Math.floor(Math.random() * (max_speed + 1 - min_speed)) + min_speed);
        dy.push(Math.floor(Math.random() * (max_speed + 1 - min_speed)) + min_speed);
        dz.push(Math.floor(Math.random() * (max_speed + 1 - min_speed)) + min_speed);
    }
    // ***

    // 毎フレーム実行する関数
    tick();

    function tick() {

        for (var i in tapiocas) {
            x[i] += dx[i];
            y[i] += dy[i];
            z[i] += dz[i];
            if (x[i] > (width / 2 - (sphere_width / 2)) || x[i] < (-width / 2 + (sphere_width / 2))) {
                dx[i] = -dx[i];
                x[i] += dx[i];
            }
            if (y[i] > (height / 2 - (sphere_height / 2)) || y[i] < (-height / 2 + (sphere_height / 2))) {
                dy[i] = -dy[i];
                y[i] += dy[i];
            }
            if (z[i] > (height / 2 - (sphere_height / 2)) || z[i] < (-height / 2 + (sphere_height / 2))) {
                dz[i] = -dz[i];
                z[i] += dz[i];
            }

            tapiocas[i].position.x = x[i];
            tapiocas[i].position.y = y[i];
            tapiocas[i].position.z = z[i];
        };

        // マウスをクリックした際にonClick関数を実行
        canvas.addEventListener('click', onClick);

        function onClick() {

            // マウス位置からまっすぐに伸びる光線ベクトルを生成
            raycaster.setFromCamera(mouse, camera);
            // 光線とぶつかったオブジェクトを取得する
            const intersects = raycaster.intersectObjects(tapiocas);
            tapiocas.map(mesh => {
                // 交差しているオブジェクトが1つ以上存在し、交差しているオブジェクトの1番目(最前面)のものだったら
                if (intersects.length > 0 && mesh === intersects[0].object) {
                    // オブジェクトを非常示にする
                    mesh.visible = false;
                    // 点数を1つ増加させる
                    score += 1;
                } else {
                    // クリックされていないオブジェクトは元の色にする
                    mesh.material.color.setHex(0x323233);
                }
            });
        }

        // score変数の値をscore idをもつ要素に代入する
        document.getElementById('score').innerHTML = 'score: ' + score;

        // すべてのオブジェクトをクリックしたら別のページへ遷移する
        if (score == sphere_num) {
            window.location.href = 'complete.html';
        }

        // シーンとカメラをレンダリング
        renderer.render(scene, camera);
        // tick関数を毎フレーム実行
        requestAnimationFrame(tick);
    }
}
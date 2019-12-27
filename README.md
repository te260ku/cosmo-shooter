# Three_FPS

## デバッグの方法
サーバー建てるときは以下のコマンドを叩く．

```
python -m http.server
```

## 参考文献

- https://ics.media/tutorial-createjs/game_shooting/
create.jsを使った2Dのシューティングゲームチュートリアル一式

- https://qiita.com/gen_abe/items/3846dd9a896782effecf
カメラ移動だけ

- https://docs.microsoft.com/ja-jp/windows/uwp/get-started/get-started-tutorial-game-js3d
恐竜から逃げるゲームのチュートリアル一式．これをベースに作っていくのがいいかも．

- https://github.com/blaze33/droneWorld
飛行機のシューティングゲーム完成版

- https://codepen.io/frhd/pen/bZJZWB
大勝利．fpsの機能一式コード

- https://github.com/saucecode/threejs-demos
学習用のチュートリアル．これで作成したソースコードはdemo内に保存．

1. cubeの表示とそのアニメーション
2. 床の生成とキー入力に応じた移動，左右の回転，ボタンクリックによるワイヤーフレームの切り替え
移動のベクトル制御とかはmicrosoftのチュートリアルを見て理論も押さえておく
```
camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
```
3. 光源の生成
- https://qiita.com/everycamel/items/6b373930e79893adb340
    - meshbasicmaterialだと影が落ちない
    - 影の出し手と受けてを指定する必要あり

- ambientlight
基本的なライトであり，すべてのオブジェクトにライトの色をつける．特定の入射角がないため影を落とさないほか，すべてのオブジェクトに対して同じ色を投影するため，単独で使われることはない．明るい色を指定するとすぐに画面全体の彩度が異常に高くなる．


4. テクスチャ
サーバー建てないとテクスチャをロードできない

5. モデルのロード
サーバー建てるの面倒だからサボっちゃおww
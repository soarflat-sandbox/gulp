# Gulp

Gulp v4 を利用した開発環境。

## Tasks

- `gulp pug`: Pugをコンパイルするタスク
- `gulp scss`: Scssをコンパイルするタスク
- `gulp images`: 画像を圧縮するタスク
- `gulp clean`: 出力先のファイル削除するタスク（開発途中で不要になったごみファイルを削除するために利用する）
- `gulp watcher`: Pug、Scss、画像の変更を監視して、それぞれのタスクを実行するタスク
- `gulp server`: サーバー（Browser Sync）を起動するタスク
- `gulp dev`: `gulp server`と`gulp watcher`を実行するタスク
- `gulp publish`: `gulp clean`と`gulp`を実行するタスク
- `gulp`（`gulp default`）: `gulp pug`、`gulp scss`、`gulp images`を実行するタスク

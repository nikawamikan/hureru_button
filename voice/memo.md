# Voiceデータ保存ディレクトリ

## 規則

- データ形式
    - ファイル形式はmp3
    - 192kbpsにしておく

- 命名規則
    - アルファベット表記で記載する
    - スネークケースで全部小文字

## ユーザーが新規に登録する際に気をつけたいこと

- 命名規則についてはフロントとサーバーで正規表現で直してもらうようにする
- データについては基本的に定めない方式でサーバー側でMP3の192kbpsに変換する

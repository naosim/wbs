WBS
===

# 環境構築
- parcel
バンドラーにはparceljsを使用しています。  
下記コマンドでインストールをお願いします。
```
npm install -g parcel-bundler
```
- config.js
設定ファイルを配置します。
./dist/config.js
```
window.config = {
  githubToken: 'your token',
  owner: 'githubリポジトリのオーナー',
  repo: 'githubのリポジトリ名',
  taskRootIssueNumber: 1,
  isDevelop: true
};
```



# ビルド
```
parcel --out-dir ./dist/js/index ./src/index.ts
```

# 使う
- config.jsを設定する
- ./dist/index.htmlをブラウザで開く



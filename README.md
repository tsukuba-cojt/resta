# Resta
WebサイトのUIをインタラクティブに変更するためのChrome拡張です。 ユーザは変更対象のWebページ上に表示される直感的なGUIを通じて、リアルタイムに既存のWebページをカスタマイズすることができます。

![main](https://github.com/tsukuba-cojt/resta/assets/26784861/00431277-748a-4c04-86e6-03d848bb5e3a)


## 開発中のプロジェクトを試す
1. 本リポジトリをクローンする
```shell
git clone https://github.com/tsukuba-cojt/resta
```
2. developブランチにチェックアウトする
```shell
git checkout develop
```
3. 依存ライブラリをインストールする
```shell
npm i
```
4. ビルドする
```shell
npm run build-react 
```
5. Google Chromeで[拡張機能のページ](chrome://extensions/)を開き、"パッケージ化されていない拡張機能を読み込む"を押下する
6. クローンした本リポジトリのディレクトリを開き、ビルドにて生成された```build```ディレクトリを選択する
7. [筑波大学のホームページ](https://www.tsukuba.ac.jp/)を開き、Restaを試す（現在デバッグのために筑波大学のホームページでのみ有効化しています）

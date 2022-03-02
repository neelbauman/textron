// メインプロセスを制御するためのメインプロセスAPI
const {app, BrowserWindow, screen} = require('electron')
// const fs = require('fs')

// 変数定義
let mainWindow
let displayWidth, displayHeight
const mainWindowHtml = 'document/_build/html/index.html'

// 開発のためのホットリロード処理
require('electron-reload')(__dirname, {
  electron: require(__dirname + '/node_modules/electron/')
})

// アプリケーションのライフサイクルの記述
app.on('ready', () => {
  displayWidth = screen.getPrimaryDisplay().workAreaSize.width
  displayHeight = screen.getPrimaryDisplay().workAreaSize.height
  mainWindow = createWindow(
    displayWidth,
    displayHeight,
    mainWindowHtml,
  );
  // デバッグ用
  mainWindow.webContents.openDevTools()

}).on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}).on('active', () => {
  if (mainWindow === null) {
    createMainWindow(displayWidth, displayHeight);
  }
});


// 関数定義
function createWindow(width, height, file) {
  let window;
  //ウィンドウの制御（レンダラプロセスの生成）の記述はメインプロセスの役割
  window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: width,
    height: height,
    show: false,
  })

  window.once('ready-to-show', () => {
      window.show()
    }).on('closed', () => {
      window = null;
    }).loadFile(file);

  return window
}

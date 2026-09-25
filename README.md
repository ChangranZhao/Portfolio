# Changran Zhao — macOS Portfolio

按提供的 macOS 桌面参考制作，已接入 10 个项目、155 张图片、12 个 Dock 图标和 SPECTRAL FLUID 的 PDF。

## 本地打开

在本目录运行 `npm start`，然后访问 http://127.0.0.1:4173 。这是带 JavaScript 模块的静态网站，请通过预览服务打开，不要直接双击 HTML。

## 操作

- 单击桌面作品打开窗口；拖动标题栏移动窗口。
- 红色按钮关闭、黄色按钮最小化到 Dock、绿色按钮最大化或恢复。
- 窗口中的 Gallery 浏览图片，About 查看项目介绍和文档。
- 点击大图进入查看器；左右方向键切换图片，Esc 关闭。＋放大，↗打开高清版本。
- 顶部放大镜或 Ctrl/⌘ + K 搜索作品。
- 顶部控制中心调整背景亮度、模糊及减少动态效果。
- Dock 中的软件入口打开相关作品索引，Photos 浏览全部图片；Terminal 支持 help、ls、open p1、about、clear。
- 手机端作品按网格排列；Dock 可左右滑动。

## 更新素材

原始素材位于本目录上一级的“素材”文件夹，网站不会修改原件。项目图片沿用 Project1 至 Project10 的目录归属；项目说明读取 Introduction.txt。

更新后运行 `scripts/prepare_assets.py`（Python 3 和 Pillow），再刷新本地预览。该脚本制作网页优化图和缩略图，并更新 `dist/data.js`。原件不会自动同步到已发布的网站，发布版本需要重新发布。

网页资源最大边长为 3200 像素；原始文件仍在素材目录中。`dist/app.js` 中 entries 管理桌面图标、坐标及图片匹配；修改素材命名后需检查对应关系。尚无文字介绍的项目直接展示已有图像资料；研究与获奖详细资料待补充。

## 文件

- `dist/`：可部署的网站。
- `scripts/prepare_assets.py`：素材整理。
- `server.mjs`：本地预览。
- `tests/state.test.mjs`：窗口状态验证。
- `qa/`：本地浏览器检查截图与结果，不随网站发布。

## 检查

`npm test` 检查窗口状态；`node scripts/verify-assets.mjs` 检查资源。浏览器检查脚本使用当前机器的 Playwright 和 Edge，若换电脑，需要修改脚本中的依赖路径。

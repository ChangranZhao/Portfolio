# Changran Zhao Portfolio

一个模仿 macOS 桌面的互动作品集，包含 10 个项目、155 张作品照片。电脑端为可移动、缩放的窗口与会漂浮的照片桌面；手机端为双列照片流与底部栏目按钮。

## 技术与本地预览

网站使用原生 JavaScript ES Modules、HTML、CSS，**没有使用 React**，也不需要安装前端依赖。运行环境为 Node.js 22 或更新版本。

- `npm start`：开发预览，打开 <http://127.0.0.1:4173/>。
- `npm test`：检查窗口状态逻辑。
- `npm run check`：检查 JavaScript 语法、项目数据和所有本地资源。
- `npm run build`：从 `dist/` 生成发布目录 `site/`。
- `npm run preview`：预览 `site/`，打开 <http://127.0.0.1:4174/>。

不要直接双击 HTML 文件：JavaScript 模块需要由网页服务器提供。`dist/` 是日常编辑的源网站；`site/` 为自动生成文件，已加入 `.gitignore`。

## 图片与加载

155 张项目照片各有小图、预览图和高清图。桌面图标、手机照片流选择适合显示尺寸的图片；未进入屏幕的图片延迟加载；展开作品时加载预览图，放大查看时才使用高清图。PDF 仅在打开对应文档时下载，不能从首页预加载。字体 Inter 从本站加载，授权文件见 `dist/assets/Inter-OFL.txt`。发布构建仅收集实际引用的资源，并为文件名添加内容指纹。自建服务器预览提供 gzip、缓存验证及 PDF 分段传输；其他托管商的缓存策略取决于其平台配置。

原始素材在上一级 `素材/` 文件夹。更新素材时，先在本机准备 Python 3、Pillow 与 pypdf，再运行 `python scripts/prepare_assets.py`；它更新网页版本，不修改原件。之后运行检查与构建命令。`scripts/optimize_resources.py` 也可单独重新生成不同尺寸的图片。

## 发布到 GitHub Pages

本项目提供 `.github/workflows/pages.yml`，**仅支持手动触发**，不会因推送代码自动发布。本地尚未上传或发布。

1. 先将本目录的源码及 `dist/` 资源提交并推送到你的 GitHub 仓库。不要只上传 `site/`：工作流会在 GitHub 上重新构建。
2. 在仓库的 **Settings → Pages → Build and deployment** 中，将来源设为 **GitHub Actions**。
3. 在仓库的 **Actions → Publish portfolio to GitHub Pages** 中运行工作流。它会执行测试、资源检查、构建，然后发布。
4. 项目页地址通常是 `https://<用户名>.github.io/<仓库名>/`；构建使用相对资源路径，已在 `/-/` 子目录模拟验证。若之后设置独立域名，再按 GitHub Pages 的设置配置域名。

`site/_headers` 是供支持该文件的托管服务使用的缓存配置，GitHub Pages 会忽略它；GitHub Pages 的缓存时间由 GitHub 控制。`site/.nojekyll` 避免 Jekyll 处理发布文件。

## 交互

顶栏 **ABOUT ME** 打开个人介绍、奖项等资料；**Project Content** 打开作品目录；**Exhibition&Paper** 打开展览和论文。照片可点击打开作品窗口，窗口支持拖动、边缘缩放、最小化和最大化。手机底部栏目可横向滑动，Gallery 回到照片流。桌面无活动窗口、停下操作后照片会缓慢移动；“减少动态效果”可关闭动画。放大镜可搜索，控制中心可调整背景与桌面尺寸。

# Creative OS — Changran Zhao Portfolio

交互作品集：14 个项目、桌面窗口、个人介绍与奖项、作品图板、Photos、Music、Unity 二维博物馆、UE 三维展厅和 TD 可编辑节点工作台。支持中英文、浅色／深色、Classic／Liquid Glass。

## 本地开发

使用 Node.js 22（版本写在 `.node-version`）和 npm：

```sh
npm ci
npm start
```

开发地址为 `http://127.0.0.1:4173/`。发布预览：

```sh
npm run build
npm run preview
```

发布预览地址为 `http://127.0.0.1:4174/`。

## GitHub 与 Cloudflare Pages

提交源代码、`package.json`、`package-lock.json`、`wrangler.jsonc`、`src/`、`scripts/`、`tests/` 和 `dist/` 中的源网页与资源。

**`dist/` 是源目录；`site/` 才是发布目录。不要把构建输出目录填写为 dist。**

Cloudflare Pages 连接 GitHub 仓库后使用以下设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Root directory | 仓库根目录 |
| Build command | `npm run build` |
| Build output directory | `site` |
| Node.js | `22` |

`wrangler.jsonc` 已指定 `pages_build_output_dir: "./site"`。不需要运行 Node 服务器或为此静态网站配置运行时密钥。不要禁用开发依赖安装：构建需要 esbuild 和 sharp。

`npm run build` 自动执行部署检查：输出文件不超过 Cloudflare Pages 免费计划的 20,000 个文件、单文件不超过 25 MiB、清单目标和 HTML/CSS 本地链接存在。

GitHub 中的 `Validate portfolio` 工作流会在推送 main 或提交 PR 时执行检查、类型检查、测试和发布构建。它只验证代码；正式网站继续由 Cloudflare 的 Git 集成部署。

```sh
npm run check:release
```

`site/`、`node_modules/`、构建缓存、临时截图和 `.env` 不提交。`dist/react-apps.js` 与 `dist/ue-gallery.js` 从源码生成，不提交；Cloudflare 会重新生成。`tmp/` 文件已退出 Git 跟踪，本地副本保留。

## 性能策略

- 发布时生成 WebP，按小图（320px）、缩略图（600px）、预览图（1280px）分别压缩；高清正文图与长图保留更高上限。源图片不覆盖。
- 资源使用内容哈希，图片、脚本与图板资源由 CDN 长期缓存；HTML 重新验证，更新后不会继续使用旧入口。
- React 应用、UE 三维库和 TD 工作台按需加载。视频和 PDF 不进入开机预加载。
- Dock 复用边界测量；玻璃层只响应窗口、菜单的真实状态变化。拖动／缩放期间保留玻璃模糊，暂缓昂贵的折射采样。
- UE、Unity 在闲置、后台或最小化时停止渲染；TD 只在拖动时请求画面更新。
- Full Project 保留不同版式和已经打开的内容；没有长页面虚拟化，也没有额外的“流畅模式”。
- TD 的节点布局、名称、备注和连接保存在浏览器本地，不会修改作品源文件。

## 源码组织

- `dist/`：桌面外壳、项目网页、翻译、静态资源。
- `src/react-apps/`：统一窗口内的 React 应用、设置及玻璃层。
- `src/ue-gallery/`：独立加载的 Three.js 展厅。
- `scripts/`：构建、资源压缩和发布检查。
- `tests/`：窗口、语言、媒体、节点和构建相关回归测试。

文化研究程序的源码位于 `culture-source/`，发布使用已提交的 `dist/culture-runtime.js`。修改文化球后运行 `node scripts/build-culture.mjs`；可通过 `CULTURE_NODE_MODULES` 指向本机所需依赖目录。普通 Cloudflare 部署不需要运行该素材导入工具。

字体和第三方代码授权随资源保留；Three.js 的授权也会嵌入单独生成的展厅脚本。

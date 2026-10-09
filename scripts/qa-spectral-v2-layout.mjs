import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const require = createRequire(path.join(root, 'Portfolio/package.json'));
const { chromium } = require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const file = process.argv[2] || path.join(root, '导出/HTML/Project02/灵韵光谱_新版十页_代码排版_20261005.html');
const shots = process.argv[3] || path.join(root, 'Portfolio/qa/spectral-v2-static');
await mkdir(shots, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1712, height: 981 }, deviceScaleFactor: 1 });
const errors = [];
const remote = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (!request.url().startsWith('file:') && !request.url().startsWith('data:')) remote.push(request.url()); });
await page.goto('file:///' + file.replaceAll('\\', '/'));
await page.evaluate(() => document.fonts.ready);
const slides = page.locator('.slide,.page');
const count = await slides.count();
const layout = [];
for (let i = 0; i < count; i++) {
  const slide = slides.nth(i);
  const info = await slide.evaluate(el => {
    const out = [];
    const box = el.getBoundingClientRect();
    for (const node of el.querySelectorAll('h1,h2,p,figcaption,.eyebrow,.chip,li,.lane,.trow')) {
      const r = node.getBoundingClientRect();
      if (r.right > box.right + 2 || r.bottom > box.bottom + 2 || r.left < box.left - 2 || r.top < box.top - 2) out.push({ tag: node.tagName, text: node.textContent.trim().slice(0, 45), x: r.x, y: r.y, w: r.width, h: r.height });
    }
    return { id: el.id, headings: [...el.querySelectorAll('h1')].map(x => x.textContent.trim()), nativeText: el.innerText.length, out };
  });
  layout.push(info);
  await slide.screenshot({ path: path.join(shots, `${String(i + 1).padStart(2, '0')}.png`) });
}
console.log(JSON.stringify({ count, errors, remote, layout }, null, 2));
await browser.close();

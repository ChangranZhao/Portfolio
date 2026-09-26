from pathlib import Path
from PIL import Image
import re,json,shutil
BASE=Path(__file__).resolve().parents[1]
SOURCE=Path(r'C:\Users\20135\Desktop\留学申请\项目整理\齐文化典籍中心\文化球\文化球')
OUT=BASE/'dist/assets/culture';OUT.mkdir(parents=True,exist_ok=True)
raw=(SOURCE/'src/archive-assets.js').read_text(encoding='utf-8')
records=json.loads(raw[raw.index('['):raw.rindex(']')+1])
for record in records:
 name=Path(record['src']).name
 with Image.open(SOURCE/'public/photos'/name) as image:
  image=image.convert('RGB');image.thumbnail((1200,1200));image.save(OUT/(Path(name).stem+'.webp'),'WEBP',quality=86)
 with Image.open(OUT/(Path(name).stem+'.webp')) as tile:
  tile.thumbnail((240,240));tile.save(OUT/(Path(name).stem+'-tile.webp'),'WEBP',quality=78)
 record['src']='assets/culture/'+Path(name).stem+'.webp'
(BASE/'dist/culture-assets.js').write_text('export const archiveAssets = '+json.dumps(records,ensure_ascii=False)+';\n',encoding='utf-8')
html=(SOURCE/'dist/index.html').read_text(encoding='utf-8')
js=next((SOURCE/'dist/assets').glob('*.js')).read_text(encoding='utf-8')
for record in records:
 name=Path(record['src']).stem
 js=js.replace('/photos/'+name+'.jpg',record['src'])
js=js.replace('localStorage.getItem("culture-language")==="en"?"en":"zh"','localStorage.getItem("culture-language")==="zh"?"zh":"en"')
if not (BASE/'culture-source').exists():
 (BASE/'dist/culture-runtime.js').write_text(js,encoding='utf-8')
css=next((SOURCE/'dist/assets').glob('*.css')).read_text(encoding='utf-8').replace('/fonts/noto-serif-sc-subset.ttf','assets/culture/noto-serif-sc-subset.ttf')
if not (BASE/'culture-source').exists():
 (BASE/'dist/culture-runtime.css').write_text(css,encoding='utf-8')
shutil.copy2(SOURCE/'public/fonts/noto-serif-sc-subset.ttf',OUT/'noto-serif-sc-subset.ttf')
shutil.copy2(SOURCE/'public/fonts/OFL.txt',OUT/'OFL.txt')
html=re.sub(r'/assets/[^" ]+\.js','./culture-runtime.js',html);html=re.sub(r'/assets/[^" ]+\.css','./culture-runtime.css',html)
(BASE/'dist/culture.html').write_text(html,encoding='utf-8')
for name in ['portfolio_design1','portfolio_design2']:
 with Image.open(BASE.parent/'素材/Project1_Wind_Blow_Front_the_East'/(name+'.png')) as image:
  image.convert('RGB').save(OUT/(name+'.webp'),'WEBP',quality=90)
print('Imported',len(records),'archive images and interactive culture board.')

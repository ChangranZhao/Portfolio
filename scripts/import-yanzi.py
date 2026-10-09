from pathlib import Path
from PIL import Image, ImageOps
import json
root=Path(__file__).resolve().parents[1]
source=root.parent/'素材/Project1_Wind_Blow_Front_the_East/Page7_Details/Project_Details4_The_Metahuman_Yanzi'
target=root/'dist/assets/yanzi';target.mkdir(parents=True,exist_ok=True)
ids=['coze-home','coze-agent','docker','funasr','ollama','mouth','recorder','coze-code','online-audio','unity','wake','unity-first','subtitles','hair-material','hair-detail','face-material','face-textures','site-01','site-02','site-03','site-04','site-05','site-06']
files=sorted(p for p in source.rglob('*') if p.suffix.lower() in ['.png','.jpg'])
assert len(files)==len(ids)
assets={}
for key,p in zip(ids,files):
 im=ImageOps.exif_transpose(Image.open(p)).convert('RGB')
 im.save(target/f'{key}-full.webp',lossless=True)
 preview=im.copy();preview.thumbnail((1600,1600));preview.save(target/f'{key}.webp',quality=88,method=6)
 assets[key]={'src':f'assets/yanzi/{key}.webp','full':f'assets/yanzi/{key}-full.webp','source':str(p.relative_to(source)).replace('\\','/'),'width':im.width,'height':im.height}
(root/'dist/yanzi-assets.js').write_text('export const yanziAssets = '+json.dumps(assets,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print(f'Imported {len(assets)} images; uncropped previews and full-resolution copies.')

"""Generate responsive display variants. Preserve full-size images and originals."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
import json

BASE = Path(__file__).resolve().parents[1]
Image.MAX_IMAGE_PIXELS = 200_000_000

def optimize(projects):
    def variant(record):
        original = BASE.parent / '素材' / record['path']
        source = original if original.exists() else BASE / 'dist' / record['src']
        stem = Path(record['src']).stem
        small = BASE / 'dist/assets' / (stem + '-small.webp')
        preview = BASE / 'dist/assets' / (stem + '-preview.webp')
        with Image.open(source) as im:
            im = ImageOps.exif_transpose(im).convert('RGB')
            for target, bounds, quality in [(small, (320,320),78), (preview,(1400,1400),83)]:
                if record.get('_refresh') or not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
                    copy=im.copy();copy.thumbnail(bounds);copy.save(target,'WEBP',quality=quality,method=6)
        with Image.open(small) as im: record['smallWidth']=im.width
        with Image.open(preview) as im: record['previewWidth']=im.width
        with Image.open(BASE / 'dist' / record['src']) as im: record['fullWidth']=im.width
        with Image.open(BASE / 'dist' / record['thumb']) as im: record['thumbWidth']=im.width
        record['small']='assets/'+small.name
        record['preview']='assets/'+preview.name
        record.pop('_refresh',None)
    records=[im for p in projects for im in p['images']]
    with ThreadPoolExecutor(max_workers=4) as pool: list(pool.map(variant,records))
    print(f'Prepared responsive variants for {len(records)} photographs',flush=True)

if __name__=='__main__':
    data=BASE/'dist/data.js'
    text=data.read_text(encoding='utf-8')
    raw,tail=text.split(';\nexport const dockIcons = ',1)
    projects=json.loads(raw.removeprefix('export const projects = '))
    optimize(projects)
    data.write_text('export const projects = '+json.dumps(projects,ensure_ascii=False)+';\nexport const dockIcons = '+tail,encoding='utf-8')

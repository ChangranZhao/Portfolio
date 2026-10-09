"""Import untouched source JPEGs plus lightweight, uncropped browser previews."""
from pathlib import Path
from PIL import Image, ImageOps
import json
import re
import shutil

root = Path(__file__).resolve().parents[1]
source = root.parent / '素材/Project1_Wind_Blow_Front_the_East/Page6_Construction'
target = root / 'dist/assets/construction-originals'
target.mkdir(parents=True, exist_ok=True)
photos = []
for stage, folder in enumerate(sorted(p for p in source.iterdir() if p.is_dir()), 1):
    files = sorted(folder.glob('*.jpg'), key=lambda p: [int(s) if s.isdigit() else s for s in re.split(r'(\d+)', p.name)])
    for index, path in enumerate(files, 1):
        stem = f'{stage:02d}-{index:02d}'
        shutil.copy2(path, target / f'{stem}.jpg')
        with Image.open(path) as raw:
            image = ImageOps.exif_transpose(raw).convert('RGB')
            width, height = image.size
            image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
            image.save(target / f'{stem}.webp', quality=86, method=6)
        photos.append(dict(id=stem, stage=stage, source=f'{folder.name}/{path.name}',
                           src=f'assets/construction-originals/{stem}.jpg',
                           preview=f'assets/construction-originals/{stem}.webp', width=width, height=height))
(root / 'dist/construction-assets.js').write_text('export const constructionPhotos = ' + json.dumps(photos, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(f'Imported {len(photos)} unchanged originals and {len(photos)} uncropped previews.')

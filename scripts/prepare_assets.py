from pathlib import Path
from PIL import Image, ImageOps
from concurrent.futures import ThreadPoolExecutor
import json, re, shutil

BASE = Path(__file__).resolve().parents[1]
SOURCE = BASE.parent / '素材'
OUT = BASE / 'dist' / 'assets'
OUT.mkdir(parents=True, exist_ok=True)
Image.MAX_IMAGE_PIXELS = 200_000_000

TITLES = {
1: ('Wind from the East', 'Spatial experience · Qi culture', 'A public cultural project in Zibo exploring the connections between cultural content, spatial experience and public engagement.'),
2: ('SPACE CHRONICLES', 'Interactive installation', 'A cross-planetary cultural exchange experiment exploring the evolution of language, cognition and identity.'),
3: ('SPECTRAL FLUID', 'Product & interaction design', ''),
4: ('ECHO-SPACE', 'Immersive experience', ''),
5: ('Tremulant Oracles', 'Installation', ''),
6: ('Changzhi Digital Museum', 'Digital reconstruction', ''),
7: ('MIMESIS — The Shape of AI', 'Digital art', ''),
8: ('GAIA HYPOTHESIS', 'Data-driven installation', 'A cross-media sensory experience tracing global forest area change through data, physical features and speculative scenarios.'),
9: ('NEURO IMMERSIVE', 'Immersive installation', ''),
10: ('Homeward Memories', 'UI design', '')
}

def natural(s):
    return [int(x) if x.isdigit() else x.lower() for x in re.split(r'(\d+)', str(s))]

def transform(job):
    p, dest = job
    full = OUT / (dest + '.webp')
    thumb = OUT / (dest + '-thumb.webp')
    with Image.open(p) as source:
        im = ImageOps.exif_transpose(source).convert('RGB')
        w, h = im.size
        if not full.exists() or full.stat().st_mtime < p.stat().st_mtime:
            large = im.copy(); large.thumbnail((3200, 3200)); large.save(full, 'WEBP', quality=88, method=4)
            small = im.copy(); small.thumbnail((600, 440)); small.save(thumb, 'WEBP', quality=84, method=4)
    return {'src': 'assets/'+full.name, 'thumb': 'assets/'+thumb.name, 'name': p.stem.replace('_', ' '), 'path': str(p.relative_to(SOURCE)).replace('\\','/'), 'width': w, 'height': h}

projects = []
for folder in sorted(SOURCE.glob('Project*'), key=lambda p: natural(p.name)):
    number = int(re.match(r'Project(\d+)', folder.name).group(1))
    images = sorted([p for p in folder.rglob('*') if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp') and not p.name.startswith('._') and '__MACOSX' not in p.parts], key=lambda p: (0 if 'front' in p.name.lower() else 1, natural(str(p.relative_to(folder)))))
    with ThreadPoolExecutor(max_workers=4) as pool:
        records = list(pool.map(transform, [(p, f'p{number}-{i:03}') for i,p in enumerate(images)]))
    title, category, summary = TITLES[number]
    introfile = folder / 'Introduction.txt'
    introduction = introfile.read_text(encoding='utf-8-sig').strip() if introfile.exists() else ''
    documents=[]
    for pdf in folder.rglob('*.pdf'):
        target=OUT / f'p{number}-{pdf.name}'
        shutil.copy2(pdf,target)
        documents.append({'name': pdf.name, 'src':'assets/'+target.name})
    projects.append({'id': f'p{number}', 'title': title, 'category': category, 'summary': summary, 'introduction': introduction, 'images':records, 'documents':documents})
    print(f'{number}: {len(records)} images', flush=True)

background=Image.open(SOURCE/'background.png').convert('RGB')
background.thumbnail((2560,1600)); background.save(OUT/'background.webp',quality=90)
icons=[]
for p in sorted(SOURCE.rglob('icons_png/*.png')):
    name=p.stem.split('_',1)[1]
    dest='dock-'+name.lower()+'.png'
    with Image.open(p) as im:
        im.thumbnail((160,160)); im.save(OUT/dest)
    icons.append({'name':name,'src':'assets/'+dest})
(BASE/'dist'/'data.js').write_text('export const projects = '+json.dumps(projects,ensure_ascii=False)+';\nexport const dockIcons = '+json.dumps(icons)+';\n',encoding='utf-8')
print(f'Prepared {len(projects)} projects, {sum(len(p["images"]) for p in projects)} images and {len(icons)} Dock icons.')

"""Prepare web-sized exhibit photographs; preserve the supplied originals."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib, json, subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / '素材/Project1_Wind_Blow_Front_the_East/Page5_SpatialDesign/Exhibit'
OUTPUT = ROOT / 'dist/assets/exhibits'
OUTPUT.mkdir(parents=True, exist_ok=True)
folders = [SOURCE / '前厅_天齐渊', SOURCE / '序厅_齐之为齐'] + sorted(p for p in SOURCE.iterdir() if p.is_dir() and p.name[:2].isdigit())
manifest, provenance = {}, []
for index, folder in enumerate(folders):
    key = ['lobby', 'preface'][index] if index < 2 else folder.name[:2]
    images, seen = [], set()
    files = sorted(p for p in folder.rglob('*') if p.suffix.lower() in {'.jpg','.jpeg','.png'})
    for source in files:
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if digest in seen:
            continue
        seen.add(digest)
        images.append((source, False))
    for video_index, source in enumerate(sorted(folder.rglob('*.mp4'))):
        meta = json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-of','json',str(source)]))
        fraction = [.2,.5,.2,.5][video_index]
        time = float(meta['format']['duration']) * fraction
        frame = ROOT / f'qa/exhibits/frame-{video_index+1}.png'
        frame.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['ffmpeg','-v','error','-ss',str(time),'-i',str(source),'-frames:v','1','-y',str(frame)], check=True)
        images.append((frame, True))
        provenance.append({'video':str(source.relative_to(SOURCE)), 'seconds':round(time,3), 'frame':frame.name})
    manifest[key] = []
    for number,(source,is_frame) in enumerate(images,1):
        with Image.open(source) as original:
            im = ImageOps.exif_transpose(original).convert('RGB')
            im.thumbnail((1920,1920), Image.Resampling.LANCZOS)
            name = f'{key}-{number:02}.webp'
            im.save(OUTPUT/name, quality=83, method=6)
            width,height = im.size
            im.thumbnail((320,240), Image.Resampling.LANCZOS)
            thumb = f'{key}-{number:02}-thumb.webp'
            im.save(OUTPUT/thumb, quality=75, method=4)
        manifest[key].append({'src':'assets/exhibits/'+name,'thumb':'assets/exhibits/'+thumb,'width':width,'height':height,'videoStill':is_frame})
    print(key, len(manifest[key]), flush=True)
(ROOT/'dist/exhibit-media.js').write_text('export const exhibitMedia = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(ROOT/'qa/exhibits/video-provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),encoding='utf-8')
print('Total MB:', round(sum(p.stat().st_size for p in OUTPUT.glob('*.webp'))/1024**2,2))

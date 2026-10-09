from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
assets = root / 'dist' / 'assets' / 'echo-process'
before = after = 0
for source in assets.glob('*.png'):
    target = source.with_suffix('.webp')
    with Image.open(source) as image:
        image.save(target, 'WEBP', lossless=True, method=6)
    before += source.stat().st_size
    after += target.stat().st_size
module = root / 'dist' / 'echo-process-board.js'
text = module.read_text(encoding='utf-8').replace('.png', '.webp')
module.write_text(text, encoding='utf-8')
print(f'Lossless original-size images: {before:,} -> {after:,} bytes.')

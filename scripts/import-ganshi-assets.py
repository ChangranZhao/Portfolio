"""Create browser-sized copies of the supplied Gan Shi Xing Jing source images."""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(r'C:\Users\20135\Desktop\留学申请\作品集\素材\Project1_Wind_Blow_Front_the_East\Page7_Details\Project_Details2_Ganshixingjing')
OUT = Path(__file__).resolve().parents[1] / 'dist' / 'assets' / 'ganshi'
OUT.mkdir(parents=True, exist_ok=True)

ASSETS = {
    'research-text-07': ('research/甘石星经 (甘望星)_07.png', 2150),
    'research-text-08': ('research/甘石星经 (甘望星)_08.png', 2150),
    'research-text-09': ('research/甘石星经 (甘望星)_09.png', 2150),
    'research-chart-09': ('research/image 9.png', 2340),
    'research-chart-10': ('research/image 10.png', 2340),
    'reference-04': ('参考/image 4.png', 1080),
    'reference-05': ('参考/image 5.png', 1080),
    'atlas-15': ('星图/image 15.png', 1080),
    'atlas-17': ('星图/image 17.png', 1080),
    'atlas-18': ('星图/image 18.png', 1080),
    'model-01': ('modeling_Preview/1.png', 3000),
    'model-02': ('modeling_Preview/2.png', 3000),
    'model-03': ('modeling_Preview/3.png', 3000),
    'model-05': ('modeling_Preview/5.png', 3000),
    'model-07': ('modeling_Preview/7.png', 3000),
    'model-workspace': ('modeling_Preview/预演工程截图.png', 2400),
    'glass-build-01': ('玻璃搭建与灯光编程/1790588341862.jpg', 2800),
    'glass-build-02': ('玻璃搭建与灯光编程/1790588341930.jpg', 2800),
    'glass-build-03': ('玻璃搭建与灯光编程/1790588524786.jpg', 2800),
    'water-particle-screen': ('中间水池装置与天空投影设计/水面投影内容_人物粒子系统_工程截图.png', 2559),
    'water-particle-output': ('中间水池装置与天空投影设计/水面投影内容_人物粒子系统_效果.png', 1123),
    'water-simulation-screen': ('中间水池装置与天空投影设计/水面投影内容_水面实时模拟_工程截图.png', 2556),
    'water-simulation-output': ('中间水池装置与天空投影设计/水面投影内容_水面实时模拟_效果.jpg', 1200),
    'water-site': ('中间水池装置与天空投影设计/水幕投影.jpg', 2400),
    'water-sky': ('中间水池装置与天空投影设计/水幕投影_天幕.jpg', 2400),
    'bamboo-workspace': ('中间水池装置与天空投影设计/竹简展开_工程截图.png', 2000),
    'bamboo-output': ('中间水池装置与天空投影设计/竹简展开_outcome.jpg', 2000),
    'outcome-01': ('outcome/1790470384927.jpg', 3000),
    'outcome-02': ('outcome/1790470385020.jpg', 3000),
    'outcome-03': ('outcome/1790470385126.jpg', 3000),
    'outcome-04': ('outcome/1790470385238.jpg', 3000),
    'outcome-05': ('outcome/1790470386169.jpg', 3000),
    'outcome-person': ('outcome/1.jpg', 2400),
}

for name, (relative, max_side) in ASSETS.items():
    source = ROOT / relative
    if not source.is_file():
        raise FileNotFoundError(source)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        destination = OUT / f'{name}.webp'
        image.save(destination, format='WEBP', quality=88, method=6)
    print(f'{destination.name}: {image.width}x{image.height}, {destination.stat().st_size:,} bytes')

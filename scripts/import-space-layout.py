"""Import the approved editable layouts and optimize their local image assets."""
from pathlib import Path
import re, shutil
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=root.parent/'导出/space-layout-v1'
target=root/'dist/assets/space-chronicles'
target.mkdir(parents=True,exist_ok=True)
html=(source/'index.html').read_text('utf-8')
refs=set(re.findall(r'assets/[\w.\-]+',html))
for ref in refs:
 src=source/ref
 if src.suffix.lower() in ['.png','.jpeg','.jpg']:
  name=src.stem+'.webp'
  im=Image.open(src); im.thumbnail((2520,2520))
  im.save(target/name,'WEBP',quality=90)
 else:
  name=src.name; shutil.copy2(src,target/name)
 html=html.replace(ref,'assets/space-chronicles/'+name)
html=re.sub(r'<nav>.*?</nav>','',html,flags=re.S)
html=re.sub(r'url\((assets/[^)]+)\)',r'url("\1")',html)
html=html.replace('</style>','body{background:#08090a;overflow:hidden}main{margin:0}.sheet{margin:0}.chrome{display:none}</style>')
html=re.sub(r'<script>.*?</script>','''<script>
const selected=Number(new URLSearchParams(location.search).get('page'));
if(selected>=1&&selected<=8){document.querySelectorAll('.sheet').forEach((sheet,index)=>{if(index!==selected-1)sheet.remove()})}
function fit(){document.querySelector('main').style.zoom=innerWidth/1600}
addEventListener('resize',fit);fit();
</script>''',html,flags=re.S)
html=html.replace('</html>','<script type="module" src="space-language.js"></script></html>')
(root/'dist/space-chronicles.html').write_text(html,encoding='utf-8')
print('Imported editable eight-page layout with',len(refs),'local assets')

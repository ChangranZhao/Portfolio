from pathlib import Path
from PIL import Image
import shutil

ICON_FILES = {
    'Figma': 'figma.png', 'Illustrator': 'Illustrator.png', 'Cursor': 'cursor.png',
    'ChatGPT': 'chatGPT.png', 'Unity': 'Unity.png', 'UnrealEngine': 'Unreal_Engine.png',
    'TouchDesigner': 'TouchDesigner.png', 'Notion': 'Notion.png', 'Photos': 'Photo.png',
    'Terminal': 'CMD.png', 'VSCode': 'VS_code.png', 'Trash': 'Trash.png'
}

def prepare_identity(source, destination):
    destination.mkdir(parents=True, exist_ok=True)
    icons=[]
    for name, filename in ICON_FILES.items():
        original=source/'icon'/filename
        target=destination/f'dock-{name.lower()}.png'
        shutil.copy2(original,target)
        icons.append({'name':name,'src':'assets/'+target.name})
    logo=source/'personal_logo'/'ps_logo.svg'
    shutil.copy2(logo,destination/'personal-logo.svg')
    shutil.copy2(logo,destination.parent/'favicon.svg')
    texture=next((source/'其他').glob('*94c398f5*.png'))
    with Image.open(texture) as im:
        canvas=Image.new('RGBA',im.size,(10,14,18,255))
        canvas.alpha_composite(im.convert('RGBA'))
        im=canvas.convert('RGB');im.thumbnail((1600,1600));im.save(destination/'profile-texture.webp',quality=88)
    return icons

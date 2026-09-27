from pathlib import Path
from fontTools import subset
from opencc import OpenCC
root=Path(__file__).resolve().parents[1];dist=root/'dist';out=dist/'assets'/'fonts';out.mkdir(exist_ok=True)
text=''.join(p.read_text(encoding='utf-8',errors='ignore') for p in dist.glob('*.js'))
text+=OpenCC('s2t').convert(text)
# Keep all Chinese and punctuation used in the website, including the authored cultural data.
chars=set(text);chars.update(chr(n) for n in range(32,127));chars.update(chr(n) for n in range(0x3000,0x3040));chars.update(chr(n) for n in range(0xff00,0xff60))
css=[]
for name,weight in [('Light',300),('Regular',400),('Medium',500),('Bold',700),('Heavy',900)]:
 path=Path(r'D:\Fonts\14款 思源黑体CN+思源宋体CN-2.0')/f'思源黑体 SourceHanSansCN-{name}.otf'
 options=subset.Options();options.flavor='woff2';font=subset.load_font(str(path),options);sub=subset.Subsetter(options=options);sub.populate(text=''.join(chars));sub.subset(font);filename=f'source-han-sans-cn-{weight}.woff2';subset.save_font(font,str(out/filename),options)
 css.append(f'@font-face{{font-family:"Portfolio Source Han Sans";src:url("assets/fonts/{filename}") format("woff2");font-style:normal;font-weight:{weight};font-display:swap;}}')
css.append('''html:lang(zh) body,html:lang(zh) body *:not(svg):not(path):not(g){font-family:"Portfolio Source Han Sans",sans-serif!important} .contains-chinese{font-family:"Portfolio Source Han Sans",sans-serif!important}.icon-label{white-space:pre-line}html:lang(zh) .field-person h2{font-size:clamp(32px,4.2cqw,65px);line-height:1.15;letter-spacing:0;font-weight:900}html:lang(zh) .field-portrait h3{font-weight:900;line-height:1.2}html:lang(zh) .field-tracking,html:lang(zh) .field-masthead,html:lang(zh) .field-footer{letter-spacing:1px}html:lang(zh) .portfolio-word{font-weight:900}html:lang(zh) .case-intro h1{line-height:1.15}html:lang(zh) .field-themes p span{display:none}''')
(dist/'chinese-fonts.css').write_text('\n'.join(css),encoding='utf-8')
print('Built five font weights; total bytes:',sum(p.stat().st_size for p in out.glob('*.woff2')))

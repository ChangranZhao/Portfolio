"""Generate lossless WOFF2 siblings. Requires fonttools and brotli; originals stay intact."""
from pathlib import Path
import re
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1] / 'dist'
fonts = list((root / 'assets/figma-fonts').glob('*.ttf'))
fonts += [root / 'assets/culture/noto-serif-sc-subset.ttf']
before = after = 0
for source in fonts:
    target = source.with_suffix('.woff2')
    original = TTFont(source, recalcTimestamp=False)
    original.flavor = 'woff2'
    original.save(target)
    decoded = TTFont(target)
    assert decoded.getBestCmap() == original.getBestCmap(), source
    assert decoded['hmtx'].metrics == original['hmtx'].metrics, source
    before += source.stat().st_size
    after += target.stat().st_size
for file in root.rglob('*'):
    if file.suffix not in {'.css', '.html', '.js'}:
        continue
    text = file.read_text(encoding='utf-8')
    updated = text
    for source in fonts:
        updated = updated.replace(source.name, source.with_suffix('.woff2').name)
    def font_rule(match):
        rule = match.group()
        if '.woff2' in rule:
            rule = rule.replace("format('truetype')", "format('woff2')").replace('format("truetype")', 'format("woff2")')
            if 'font-display' not in rule:
                rule = rule[:-1].rstrip().rstrip(';') + ';font-display:swap;}'
        return rule
    updated = re.sub(r'@font-face\s*\{[^}]+\}', font_rule, updated)
    if updated != text:
        file.write_text(updated, encoding='utf-8')
print(f'{len(fonts)} fonts: {before:,} -> {after:,} bytes; glyph maps and advance widths unchanged.')

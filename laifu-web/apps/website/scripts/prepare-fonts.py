import hashlib
import json
import sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
plan = json.loads((root / 'assets/font-subsets.json').read_text())
if len(sys.argv) > 1:
    source = Path(sys.argv[1])
    font = TTFont(source)
    characters = set(range(32, 127)) | set(map(ord, '焕屿')) | set(plan['sans'])
    folders = [root / 'src', root / '../../shared', root / '../admin/app', root / '../admin/components', root / '../admin/lib', root / '../assessments/app', root / '../assessments/components', root / '../assessments/lib', root / '../assessments/data', root / '../../../laifu-cms/seed-data']
    for folder in folders:
        for file in folder.rglob('*'):
            if file.suffix in {'.ts', '.tsx', '.js', '.json', '.mdx'}:
                characters.update(map(ord, file.read_text(encoding='utf-8')))
    cutter = subset.Subsetter(options=subset.Options())
    cutter.populate(unicodes=characters & set(font.getBestCmap()))
    cutter.subset(font)
    font.flavor = 'woff2'
    font.save(root / 'src/app/fonts/noto-sans-sc-site.woff2')
output = root / 'public/fonts'
output.mkdir(parents=True, exist_ok=True)
css = ['@layer tokens {', '  :root { --font-noto-sans-sc: "notoSans", "notoSans Fallback"; }', '}', '@layer base {']
preloads = []
expected = set()
for role, name in [('sans', 'noto-sans-sc-site')]:
    source = root / f'src/app/fonts/{name}.woff2'
    available = set(TTFont(source).getBestCmap())
    common = sorted(set(plan[role]) & available)
    remaining = sorted(available - set(common))
    groups = [common] + [remaining[i:i + 128] for i in range(0, len(remaining), 128)]
    family = 'notoSans'
    for index, points in enumerate(groups):
        font = TTFont(source)
        options = subset.Options()
        options.hinting = False
        cutter = subset.Subsetter(options=options)
        cutter.populate(unicodes=points)
        cutter.subset(font)
        font.flavor = 'woff2'
        temporary = output / f'{role}.woff2'
        font.save(temporary)
        digest = hashlib.sha256(temporary.read_bytes()).hexdigest()[:12]
        name_out = f'{role}-{digest}.woff2'
        temporary.replace(output / name_out)
        expected.add(name_out)
        ranges = ','.join(f'U+{point:X}' for point in points)
        css.append(f'  @font-face {{ font-family: "{family}"; src: url("/fonts/{name_out}") format("woff2"); font-display: swap; font-weight: 100 900; unicode-range: {ranges}; }}')
        if index == 0:
            preloads.append(f'/fonts/{name_out}')
    ascent, descent, adjust = ('117.61%', '29.20%', '98.63%')
    css.append(f'  @font-face {{ font-family: "{family} Fallback"; src: local("Arial"); ascent-override: {ascent}; descent-override: {descent}; line-gap-override: 0%; size-adjust: {adjust}; }}')
(root / 'src/app/fonts.css').write_text('\n'.join(css + ['}', '']))
(root / 'src/content/font-preloads.json').write_text(json.dumps(preloads, indent=2) + '\n')
print(f'Prepared {len(expected)} font shards: {sum((output / name).stat().st_size for name in expected)} bytes; existing files preserved')

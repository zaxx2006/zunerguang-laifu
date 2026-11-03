import hashlib
import json
import sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
source_hash = 'a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da'
if hashlib.sha256(source.read_bytes()).hexdigest() != source_hash:
    raise ValueError('Font source does not match the recorded Google Fonts version')
output = root / 'assets/fonts'
available = set(TTFont(source).getBestCmap())
characters = set(range(32, 127))
for folder in ['app', 'components', 'lib', 'data']:
    for file in (root / folder).rglob('*.js'):
        characters.update(map(ord, file.read_text()))
characters.update(map(ord, (root / '../../shared/site-navigation.ts').read_text(encoding='utf-8')))
characters &= available
common = sorted(set(json.loads((root / 'assets/font-common.json').read_text())) & characters)
remaining = sorted(characters - set(common))
groups = [common] + [remaining[i:i + 128] for i in range(0, len(remaining), 128)]
css = ['@layer tokens { :root { --font-noto-sans-sc: "LaifuAssessmentSans", "Noto Sans SC", sans-serif; } }', '@layer base {']
expected = set()
for points in groups:
    font = TTFont(source)
    options = subset.Options()
    options.hinting = False
    cutter = subset.Subsetter(options=options)
    cutter.populate(unicodes=points)
    cutter.subset(font)
    font.flavor = 'woff2'
    temporary = output / 'subset.woff2'
    font.save(temporary)
    name = f'sans-{hashlib.sha256(temporary.read_bytes()).hexdigest()[:12]}.woff2'
    temporary.replace(output / name)
    expected.add(name)
    ranges = ','.join(f'U+{point:X}' for point in points)
    css.append(f'  @font-face {{ font-family: "LaifuAssessmentSans"; src: url("../assets/fonts/{name}") format("woff2"); font-display: swap; font-weight: 100 900; unicode-range: {ranges}; }}')
# Retain previous font shards so earlier page versions remain recoverable.
(root / 'styles/fonts.css').write_text('\n'.join(css + ['}', '']))
(output / 'source.json').write_text(json.dumps({'url': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf', 'sha256': source_hash, 'license': 'OFL-1.1', 'characters': len(characters), 'codepoints': sorted(characters)}, indent=2) + '\n')
print(f'Prepared {len(expected)} font shards covering {len(characters)} characters: {sum(p.stat().st_size for p in output.glob("*.woff2"))} bytes')

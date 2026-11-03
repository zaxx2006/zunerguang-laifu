import hashlib
import json
import posixpath
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

source = Path(sys.argv[1])
destination = Path(__file__).resolve().parent.parent / 'docs/requirements'
destination.mkdir(parents=True, exist_ok=True)
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
archive = zipfile.ZipFile(source)
strings = [''.join(t.text or '' for t in e.findall('.//s:t', ns)) for e in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
relations = {e.get('Id'): e.get('Target') for e in ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))}
sheets = []
for sheet in ET.fromstring(archive.read('xl/workbook.xml')).findall('s:sheets/s:sheet', ns):
    target = relations[sheet.get('{'+ns['r']+'}id')]
    target = target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/'+target)
    root = ET.fromstring(archive.read(target))
    rows = []
    for row in root.findall('s:sheetData/s:row', ns):
        cells = {}
        for cell in row.findall('s:c', ns):
            value = cell.find('s:v', ns)
            text = value.text if value is not None else ''.join(t.text or '' for t in cell.findall('.//s:t', ns))
            if cell.get('t') == 's' and value is not None:
                text = strings[int(value.text)]
            if text:
                cells[cell.get('r')] = text
        if cells:
            rows.append({'row': int(row.get('r')), 'cells': cells})
    relpath = posixpath.dirname(target)+'/_rels/'+posixpath.basename(target)+'.rels'
    extras = [e.attrib for e in ET.fromstring(archive.read(relpath))] if relpath in archive.namelist() else []
    sheets.append({'sheet': sheet.get('name'), 'state': sheet.get('state', 'visible'), 'rows': rows, 'merges': [e.get('ref') for e in root.findall('s:mergeCells/s:mergeCell', ns)], 'relationships': extras})
snapshot = {'filename': source.name, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'sheets': sheets}
(destination / 'workbook-2026-09-03.json').write_text(json.dumps(snapshot, ensure_ascii=False, indent=2)+'\n')
print(f'Extracted {len(sheets)} worksheets, {sum(len(s["rows"]) for s in sheets)} nonempty rows; SHA-256 {snapshot["sha256"]}')

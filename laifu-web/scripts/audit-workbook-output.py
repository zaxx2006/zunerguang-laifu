import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path

root = Path(__file__).resolve().parent.parent
snapshot = json.loads((root / 'docs/requirements/workbook-2026-09-03.json').read_text())
out = root / 'apps/website/out'

class PageText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.ids = []
        self.links = []
        self.meta = {}
        self.in_title = False
        self.skip = False
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag in ['script', 'style']:
            self.skip = True
        if 'id' in values:
            self.ids.append(values['id'])
        if tag == 'a' and 'href' in values:
            self.links.append(values['href'])
        if tag == 'meta' and 'name' in values:
            self.meta[values['name']] = values.get('content', '')
        if tag == 'title':
            self.in_title = True
    def handle_endtag(self, tag):
        if tag in ['script', 'style']:
            self.skip = False
        if tag == 'title':
            self.in_title = False
    def handle_data(self, data):
        if not self.skip:
            self.text.append(data)
        if self.in_title:
            self.meta['title'] = self.meta.get('title', '')+data

def normalize(text):
    return re.sub(r'[\s·•🔹\u200c：:｜|、（）()「」“”"《》,，。；;？！?！—–\-→.．/]', '', html.unescape(text))

parsed = {}
for file in out.rglob('*.html'):
    page = PageText()
    page.feed(file.read_text())
    parsed['/'+str(file.relative_to(out)).replace('index.html', '')] = page
site_text = normalize(''.join(''.join(page.text) for page in parsed.values()))
sheet_routes = {1: ['/', '/services/'], 2: ['/about/'], 3: ['/about/founder/'], 4: ['/services/divorce-coaching/'], 6: ['/services/co-parenting/'], 7: ['/services/mediation-preparation/'], 8: ['/services/post-divorce-recovery/'], 10: ['/collaborative-law/'], 11: ['/services/high-conflict-divorce/'], 12: ['/services/nuptial-agreements/'], 13: ['/academy/'], 14: ['/courses-workshops/'], 15: ['/retreats-workshops/'], 16: ['/resources/'], 17: ['/blog/']+[route for route in parsed if route.startswith('/blog/topics/')], 18: ['/media/'], 19: ['/faq/'], 20: ['/book-consultation/'], 23: ['/services/remarriage-preparation/']}
failures = []
checked = 0
excluded = []
for index, sheet in enumerate(snapshot['sheets']):
    if index in [0, 5, 9, 21, 22, 24, 25]:
        excluded.append({'sheet': sheet['sheet'], 'reason': {0: '图片参考；文本导航要求优先', 5: '由更新版第7表覆盖', 9: '由更新版第11表覆盖', 21: '导航交互单独验收', 22: '页脚单独验收', 24: '媒体栏目重复页头', 25: '明确删除的独立服务'}[index]})
        continue
    site_text = normalize(''.join(''.join(parsed[route].text) for route in sheet_routes[index]))
    for row in sheet['rows']:
        number = row['row']
        if number < 3:
            continue
        cells = row['cells']
        value = cells.get('G'+str(number), '').strip()
        override = cells.get('H'+str(number), '').strip()
        if index in [1, 2, 11] and override and not re.match(r'^(【|备注|删|内置|/)', override):
            value = override
        if override.startswith('删') or value in ['', '/', '删除', '删', '补充预约二维码']:
            continue
        if index == 1 and (62 <= number <= 94 or number in [54, 55, 56, 123, 124, 125]):
            continue
        if value.startswith('SEO'):
            continue
        value = value.split('SEO')[0]
        for line in value.splitlines():
            line = line.strip()
            if not line or re.match(r'^(按钮(?:文案)?[：:]?$|(?:主|次|辅助)按钮[：:]?$|链接地址|板块提示|模型总结|页面结尾行动引导|自测问题|自测维度)', line):
                continue
            line = re.sub(r'^(?:[·\s]*(?:主|次|辅助)?按钮(?:文案)?[：:]|建议跳转页面[：:]|主要问题[：:]|第七板块｜|页面英文名：|卡片[一二三四五六]｜)', '', line).strip()
            line = re.sub(r'\s*→\s*https?://\S+', '', line)
            if index == 10 and number in [20, 21, 22, 38, 39, 40, 41, 42]:
                line = re.sub(r'^(支持方式|谁参加、怎样参加|需先说明的规则与承诺|角色|主要负责|不负责)：', '', line)
            if index == 23 and number == 23:
                for label in line.split('｜'):
                    if normalize(label) not in site_text:
                        failures.append({'sheet': sheet['sheet'], 'cell': 'G23', 'text': label})
                continue
            normalized = normalize(line)
            if normalized and normalized not in site_text:
                failures.append({'sheet': sheet['sheet'], 'cell': ('H' if value == override else 'G')+str(number), 'text': line})
            checked += 1
auxiliary = [(4, number, col) for number in range(33, 39) for col in ['I', 'J', 'K', 'L']] + [(23, number, 'H') for number in range(16, 23)]
for index, number, col in auxiliary:
    row = next(row for row in snapshot['sheets'][index]['rows'] if row['row'] == number)
    value = row['cells'].get(col+str(number), '')
    route_text = normalize(''.join(''.join(parsed[route].text) for route in sheet_routes[index]))
    for line in value.splitlines():
        if line.strip() and normalize(line) not in route_text:
            failures.append({'sheet': snapshot['sheets'][index]['sheet'], 'cell': col+str(number), 'text': line})
        checked += 1
for index, routes in sheet_routes.items():
    for row in snapshot['sheets'][index]['rows']:
        value = row['cells'].get('A'+str(row['row']), '')
        if value.startswith('CTA'):
            cta = re.split(r'SEO\s*(?:设置|优化)', value)[0]
            lines = cta.splitlines()
            lines[0] = lines[0].partition('｜')[2]
            route_text = normalize(''.join(''.join(parsed[route].text) for route in routes))
            for line in lines:
                line = re.sub(r'^(?:按钮文案[：:]?|[·•])', '', line).strip()
                if line and line not in ['主要按钮', '服务入口'] and normalize(line) not in route_text:
                    failures.append({'sheet': snapshot['sheets'][index]['sheet'], 'cell': 'A'+str(row['row']), 'text': line})
                checked += 1
        notes = value+'\n'+row['cells'].get('G'+str(row['row']), '')
        description = re.search(r'SEO\s*描述\s*\n([^\n]+)', notes)
        if description and not any(normalize(description[1]) == normalize(parsed[route].meta.get('description', '')) for route in routes):
            failures.append({'sheet': snapshot['sheets'][index]['sheet'], 'cell': 'A'+str(row['row']), 'text': 'SEO 描述不一致'})
        if description:
            checked += 1
        title = re.search(r'SEO\s*标题\s*\n([^\n]+)', notes)
        if title and not any(normalize(title[1]) in normalize(parsed[route].meta.get('title', '')) for route in routes):
            failures.append({'sheet': snapshot['sheets'][index]['sheet'], 'cell': 'A/G'+str(row['row']), 'text': 'SEO 标题不一致'})
        if title:
            checked += 1
footer = next(row['cells']['A2'] for row in snapshot['sheets'][22]['rows'] if 'A2' in row['cells']).split('\n', 1)[1]
for route, page in parsed.items():
    if page.ids and 'main-content' in page.ids and normalize(footer) not in normalize(''.join(page.text)):
        failures.append({'sheet': snapshot['sheets'][22]['sheet'], 'cell': 'A2', 'text': route+' 页脚品牌文案不一致'})
link_failures = []
deleted_remainders = []
for index, routes in sheet_routes.items():
    for row in snapshot['sheets'][index]['rows']:
        cells, number = row['cells'], str(row['row'])
        if not (cells.get('D'+number, '').startswith('删') or cells.get('H'+number, '').startswith('删')):
            continue
        previous = normalize(cells.get('F'+number, ''))
        if len(previous) < 15:
            continue
        if any(previous in normalize(''.join(parsed[route].text)) for route in routes):
            deleted_remainders.append({'sheet': snapshot['sheets'][index]['sheet'], 'cell': 'F'+number})
for route, page in parsed.items():
    if len(page.ids) != len(set(page.ids)):
        link_failures.append(route+' duplicate IDs')
    for link in page.links:
        if not link.startswith(('/', '#')) or link.startswith('/_next/'):
            continue
        target, _, fragment = link.partition('#')
        target = target or route
        if target not in parsed:
            if not (out / target.lstrip('/')).is_file():
                link_failures.append(route+' → '+link)
        elif fragment and fragment not in parsed[target].ids:
            link_failures.append(route+' → missing # '+link)
report = {'sourceSha256': snapshot['sha256'], 'checkedTextLines': checked, 'missingText': failures, 'deletedTextRemainders': deleted_remainders, 'brokenLinks': sorted(set(link_failures)), 'sheetDecisions': excluded}
(root / 'docs/requirements/output-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({'checked': checked, 'missingText': len(failures), 'deletedRemainders': deleted_remainders, 'brokenLinks': len(set(link_failures))}, ensure_ascii=False))
for item in failures[:100]:
    print(item)
for item in sorted(set(link_failures))[:50]:
    print(item)
if failures or link_failures or deleted_remainders:
    raise SystemExit(1)

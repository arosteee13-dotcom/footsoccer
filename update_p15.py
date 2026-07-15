import re, json

with open('js/data/poland.js', 'r') as f:
    content = f.read()

def update_player(content, pid, img_id=None, pos=None, mp=None, other=None, foot=None):
    if img_id:
        pat = re.compile(r'(' + re.escape(pid) + r".*?avatar: )'[^']*'")
        new_url = 'https://cdn.resfu.com/img_data/players/medium/' + img_id + '.jpg?size=120x&lossy=1'
        content = pat.sub(r'\1' + "'" + new_url + "'", content)
    
    if pos:
        pat = re.compile(r'(' + re.escape(pid) + r".*?position: )'[^']*'")
        content = pat.sub(r"\1'" + pos + "'", content)
    
    if foot:
        pat = re.compile(r'(' + re.escape(pid) + r".*?foot: )'[^']*'")
        content = pat.sub(r"\1'" + foot + "'", content)
    
    # Remove old mainPct/otherPositions from this player entry
    pat = re.compile(r'(' + re.escape(pid) + r".*?)(, mainPct: \d+)?(, otherPositions: \[[^\]]+\])?')
    content = pat.sub(r'\1', content)
    
    # Add new mainPct/otherPositions after nationality
    if mp or other:
        pat = re.compile(r'(' + re.escape(pid) + r".*?nationality: '[^']+')")
        extra = ''
        if mp:
            extra += ', mainPct: ' + str(mp)
        if other:
            extra += ', otherPositions: ' + json.dumps(other)
        content = pat.sub(r'\1' + extra, content)
    
    return content

updates = [
    ('p15-1',  '191776', None, None, None, None),
    ('p15-2',  '894766', None, None, None, 'AMB'),
    ('p15-3',  '226998', 'defensa_central', 96, [{'pos': 'mediocentro', 'pct': 4}], None),
    ('p15-4',  '142159', 'defensa_central', 99, [{'pos': 'lateral_izq', 'pct': 1}], 'IZQ'),
    ('p15-5',  '3375796', 'lateral_izq', 82, [{'pos': 'carrilero_izq', 'pct': 18}], 'IZQ'),
    ('p15-6',  '220552', 'defensa_central', 89, [{'pos': 'lateral_izq', 'pct': 11}], 'IZQ'),
    ('p15-7',  '445181', 'carrilero_der', 88, [{'pos': 'extremo_der', 'pct': 12}], None),
    ('p15-8',  '289873', 'carrilero_izq', 76, [{'pos': 'medio_izq', 'pct': 24}], 'IZQ'),
    ('p15-9',  '367224', 'carrilero_der', 79, [{'pos': 'extremo_der', 'pct': 21}], None),
    ('p15-10', '3161318', 'defensa_central', 81, [{'pos': 'lateral_der', 'pct': 19}], None),
    ('p15-11', '296291', 'defensa_central', 99, [{'pos': 'carrilero_izq', 'pct': 1}], 'IZQ'),
    ('p15-12', None, 'carrilero_der', 85, [{'pos': 'medio_der', 'pct': 15}], 'AMB'),
]

for pid, img_id, pos, mp, other, foot in updates:
    content = update_player(content, pid, img_id, pos, mp, other, foot)

with open('js/data/poland.js', 'w') as f:
    f.write(content)

print('Done')

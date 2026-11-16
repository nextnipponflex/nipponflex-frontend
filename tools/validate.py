"""Validate a buildless portal checkout or an extracted HTML export."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
errors=[];counts={'html':0,'css':0,'javascript':0}
class CheckHTML(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path;self.base=path.parent;self.ids=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='base':self.base=(self.path.parent/a['href']).resolve()
  if a.get('id'):
   if a['id'] in self.ids:errors.append([str(self.path),'Duplicate id: '+a['id']])
   self.ids.add(a['id'])
  for name in ['src','href','poster']:
   u=a.get(name,'')
   if tag=='base' or not u or u.startswith(('http:','https:','data:','#','mailto:','tel:','javascript:')):continue
   p=u.split('?')[0].split('#')[0]
   if p and not (self.base/p).exists():errors.append([str(self.path),'Missing asset: '+u])
for p in PUBLIC.rglob('*.html'):
 counts['html']+=1;CheckHTML(p).feed(p.read_text())
for p in PUBLIC.rglob('*.css'):
 counts['css']+=1
 for u in re.findall(r'url\([\"\']?([^\)\"\']+)',p.read_text()):
  if not u.startswith(('http:','https:','data:','#')) and not (p.parent/u).exists():errors.append([str(p),'Missing CSS resource: '+u])
for p in PUBLIC.rglob('*.js'):
 counts['javascript']+=1
 result=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
 if result.returncode:errors.append([str(p),result.stderr])
 # Dynamic flags are not literal asset paths: validate their complete supported set.
 if 'assets/flags/${' in p.read_text(errors='ignore'):
  for code in ['AR','BR','CL','CO','MX','PE','PY']:
   if not (PUBLIC/'assets/flags'/f'{code}.svg').is_file():errors.append([str(p),'Missing dynamic flag: '+code])
print(json.dumps({'checked':counts,'errors':errors},ensure_ascii=False,indent=2))
sys.exit(bool(errors))

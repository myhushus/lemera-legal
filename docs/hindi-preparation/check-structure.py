# coding: utf-8
from pathlib import Path
import subprocess,re,json
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
p=Path('public');errors=[];count=0
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  global count
  for k,v in attrs:
   if k not in ['href','src'] or not v:continue
   u=urlsplit(v)
   if u.scheme or u.netloc or not u.path:continue
   q=(p/unquote(u.path).lstrip('/')) if u.path.startswith('/') else self.file.parent/unquote(u.path)
   if q.is_dir():q=q/'index.html'
   count+=1
   if not q.exists():errors.append((str(self.file),v))
for f in p.rglob('*.html'):
 parser=Links();parser.file=f;parser.feed(f.read_text())
changed=subprocess.check_output(['git','diff','--name-only'],text=True).splitlines();preserved=0
for f in changed:
 if re.search(r'public/(privacy/.+/v1.4/[^/]+\.html|terms/.+/v1.2/index.html)$',f):
  old=subprocess.check_output(['git','show','HEAD:'+f],text=True);new=Path(f).read_text()
  clean=lambda s:re.sub('<nav>.*?</nav>','',s,flags=re.S)
  assert clean(old)==clean(new),f;preserved+=1
# Every preexisting original license, source, historic policy file remains byte-identical.
for f in changed:
 assert not any(x in f for x in ['/sources/','/data/','/history/','/v1.0/','/v1.1/','/v1.3/']),f
r={'internal_references':count,'broken':errors,'existing_policy_bodies_unchanged':preserved};Path('docs/hindi-preparation/structure.json').write_text(json.dumps(r,indent=2));print(json.dumps(r));assert not errors

"""Conservative CSS cleanup. Preserve rule order, media context and specificity."""
import re

def split_top(text, separator):
    out=[]; start=0; quote=None; escape=False; depth=0; i=0
    while i<len(text):
        c=text[i]
        if quote:
            if escape: escape=False
            elif c=='\\': escape=True
            elif c==quote: quote=None
        elif c in '\"\'': quote=c
        elif c in '([': depth+=1
        elif c in ')]': depth-=1
        elif c==separator and not depth: out.append(text[start:i]);start=i+1
        i+=1
    out.append(text[start:]);return out

def blocks(text, context=()):
    text=re.sub(r'/\*[\s\S]*?\*/','',text);i=0;out=[]
    while i<len(text):
        while i<len(text) and text[i].isspace():i+=1
        if i==len(text):break
        start=i;quote=None;escape=False;paren=0
        while i<len(text):
            c=text[i]
            if quote:
                if escape:escape=False
                elif c=='\\':escape=True
                elif c==quote:quote=None
            elif c in '\"\'':quote=c
            elif c in '([':paren+=1
            elif c in ')]':paren-=1
            elif not paren and c in '{;':break
            i+=1
        header=text[start:i].strip()
        if i==len(text):
            if header:raise ValueError('Unterminated CSS: '+header[:100])
            break
        if text[i]==';':out.append({'ctx':context,'raw':header+';'});i+=1;continue
        i+=1;start_body=i;depth=1;quote=None;escape=False
        while i<len(text) and depth:
            c=text[i]
            if quote:
                if escape:escape=False
                elif c=='\\':escape=True
                elif c==quote:quote=None
            elif c in '\"\'':quote=c
            elif c=='{':depth+=1
            elif c=='}':depth-=1
            i+=1
        if depth:raise ValueError('Unclosed CSS: '+header)
        body=text[start_body:i-1]
        if re.match(r'@(media|supports|container|layer)\b',header):
            out+=blocks(body,context+(re.sub(r'\s+',' ',header),))
        elif header.startswith('@'):
            out.append({'ctx':context,'raw':header+' {\n'+body+'\n}'})
        else:
            declarations=[]
            for declaration in split_top(body,';'):
                pair=split_top(declaration,':')
                if len(pair)<2:
                    if declaration.strip():raise ValueError('Invalid declaration '+declaration)
                    continue
                prop=pair[0].strip();value=':'.join(pair[1:]).strip()
                if not prop or not value:continue
                important=bool(re.search(r'!\s*important\s*$',value,re.I))
                declarations.append((prop,value,important))
            for selector in split_top(header,','):
                out.append({'ctx':context,'selector':selector.strip(),'decls':list(declarations)})
    return out

def clean_css(text):
    rules=blocks(text);before=sum(len(x.get('decls',[])) for x in rules);seen={}
    for rule in reversed(rules):
        if 'raw' in rule:continue
        keep=[]
        for prop,value,important in reversed(rule['decls']):
            key=(rule['ctx'],rule['selector'],prop)
            prior=seen.get(key,set())
            if True in prior or important in prior:continue
            keep.append((prop,value,important));seen.setdefault(key,set()).add(important)
        rule['decls']=list(reversed(keep))
    rules=[r for r in rules if 'raw' in r or r['decls']]
    # Only merge adjacent identical blocks; no reordering across selectors or media queries.
    merged=[]
    for rule in rules:
        if merged and 'decls' in rule and 'decls' in merged[-1] and rule['ctx']==merged[-1]['ctx'] and rule['decls']==merged[-1]['decls']:
            merged[-1]['selector']+=',\n'+rule['selector']
        else:merged.append(rule)
    output=[];current=[]
    for rule in merged:
        ctx=list(rule['ctx']);common=0
        while common<min(len(ctx),len(current)) and ctx[common]==current[common]:common+=1
        for _ in current[common:]:output.append('}')
        for h in ctx[common:]:output.append(h+' {')
        current=ctx
        if 'raw' in rule:output.append(rule['raw']);continue
        output.append(rule['selector']+' {')
        for p,v,_ in rule['decls']:output.append('  '+p+': '+v+';')
        output.append('}')
    output.extend('}' for _ in current)
    return '\n'.join(output)+'\n',{'declarations_before':before,'declarations_after':sum(len(r.get('decls',[])) for r in rules),'rules_after':len(merged)}

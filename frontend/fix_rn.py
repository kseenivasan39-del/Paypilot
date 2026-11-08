import os

path = 'src/app/settings/security/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('ShieldCheck, Calendar, User\\r\\n} from', 'ShieldCheck, Calendar, User\n} from')
content = content.replace('ShieldCheck, Calendar\\r\\n}', 'ShieldCheck, Calendar, User\n}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

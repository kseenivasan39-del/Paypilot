import os
path = 'src/app/ai/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('CheckCheck, ChevronRight\\r\\n} from \"lucide-react\";', 'CheckCheck, ChevronRight\n} from \"lucide-react\";')
content = content.replace('CheckCheck\\r\\n}', 'CheckCheck, ChevronRight\n}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

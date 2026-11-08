import os

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content = content.replace('href=\"#\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors relative\">\n            <MessageSquare', 'href=\"/messages\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors relative\">\n            <MessageSquare')
            content = content.replace('href=\"#\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <MessageSquare', 'href=\"/messages\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <MessageSquare')
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)

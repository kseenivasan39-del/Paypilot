import os
import re

count = 0
for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            path = os.path.join(root, file)
            if os.path.normpath(path) == os.path.normpath('src/app/page.tsx'):
                continue
                
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            pattern = re.compile(r'(<Link href=")/dashboard/client(" className="[^"]*hover:opacity-90 transition-opacity"[^>]*>(\s*<div.*?PayPilot</span>\s*)</Link>)', re.DOTALL)
            
            def replacer(match):
                return match.group(1) + '/' + match.group(2)
            
            if re.search(pattern, content):
                new_content = re.sub(pattern, replacer, content)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1

print(f"Regex replaced {count} files.")

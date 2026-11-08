import os
import re

count = 0
for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Very permissive regex to match the logo div
            pattern = re.compile(r'<div className="p-6 flex items-center gap-3 mb-4[^>]*>(\s*<div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2[^>]*>.*?<svg.*?xmlns="http://www.w3.org/2000/svg".*?>.*?<path.*?/path>\s*</svg>\s*</div>\s*<span className="text-2xl font-bold text-white tracking-tight">PayPilot</span>\s*)</div>', re.DOTALL)
            
            def replacer(match):
                inner_content = match.group(1)
                full_match = match.group(0)
                class_str = re.search(r'<div className="([^"]+)"', full_match).group(1)
                new_class = class_str + " hover:opacity-90 transition-opacity"
                return f'<Link href="/dashboard/client" className="{new_class}">{inner_content}</Link>'
            
            if re.search(pattern, content):
                new_content = re.sub(pattern, replacer, content)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1

print(f"Regex replaced {count} files.")

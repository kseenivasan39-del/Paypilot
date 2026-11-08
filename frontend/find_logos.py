import os

count = 0
for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if '<div className="p-6 flex items-center gap-3' in content and 'PayPilot</span>' in content:
                print(path)
                count += 1
print(f"Found {count} files.")

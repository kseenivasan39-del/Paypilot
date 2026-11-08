import os

files_to_update = [
    'src/app/page.tsx',
    'src/app/how-it-works/page.tsx',
    'src/app/for-clients/page.tsx'
]

for file in files_to_update:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace href="#" for For Clients
        content = content.replace(
            '<Link href="#" className="hover:text-white transition-colors">For Clients</Link>',
            '<Link href="/for-clients" className="hover:text-white transition-colors">For Clients</Link>'
        )
        
        # In src/app/page.tsx, if For Clients is currently just "#", make it point to /for-clients
        # In src/app/how-it-works/page.tsx, do the same.
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Updated links successfully!")

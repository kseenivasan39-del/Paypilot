import os

files_to_update = [
    'src/app/page.tsx',
    'src/app/how-it-works/page.tsx',
    'src/app/for-clients/page.tsx',
    'src/app/for-freelancers/page.tsx'
]

for file in files_to_update:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace href="#" for For Freelancers
        content = content.replace(
            '<Link href="#" className="hover:text-white transition-colors">For Freelancers</Link>',
            '<Link href="/for-freelancers" className="hover:text-white transition-colors">For Freelancers</Link>'
        )
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Updated links successfully!")

import os

files_to_update = [
    'src/app/page.tsx',
    'src/app/how-it-works/page.tsx',
    'src/app/for-clients/page.tsx',
    'src/app/for-freelancers/page.tsx',
    'src/app/pricing/page.tsx'
]

for file in files_to_update:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace href="#" for Pricing
        content = content.replace(
            '<Link href="#" className="hover:text-white transition-colors">Pricing</Link>',
            '<Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>'
        )
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Updated links successfully!")

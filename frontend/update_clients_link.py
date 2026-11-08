import os

for path in ['src/app/page.tsx', 'src/app/how-it-works/page.tsx', 'src/app/for-clients/page.tsx']:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update For Clients link
    content = content.replace(
        '<Link href="#" className="hover:text-white transition-colors">For Clients</Link>',
        '<Link href="/for-clients" className="hover:text-white transition-colors">For Clients</Link>'
    )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated links")

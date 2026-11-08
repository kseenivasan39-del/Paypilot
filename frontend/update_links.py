import os

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<Link href="#" className="hover:text-white transition-colors">How it works</Link>',
    '<Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>'
)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

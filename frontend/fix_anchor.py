import os

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update the link
content = content.replace(
    '<Link href="#" className="hover:text-white transition-colors">How it works</Link>',
    '<Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>'
)

# Add ID to the section
content = content.replace(
    '<section className="relative z-20 px-8 py-24 max-w-[1600px] mx-auto border-t border-slate-800/50 mt-12 bg-[#05030f]">',
    '<section id="how-it-works" className="relative z-20 px-8 py-24 max-w-[1600px] mx-auto border-t border-slate-800/50 mt-12 bg-[#05030f] scroll-mt-24">'
)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated link and section ID.")

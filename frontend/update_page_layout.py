import os

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace overflow-hidden with overflow-x-hidden on the main wrapper
content = content.replace('overflow-hidden relative', 'overflow-x-hidden relative')

# Change floating stats bar from absolute bottom-8 to relative
content = content.replace('<div className=\"absolute bottom-8 left-0 w-full z-20 px-8\">', '<div className=\"relative w-full z-20 px-8 mt-12 pb-24\">')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

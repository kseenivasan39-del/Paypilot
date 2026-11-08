import os

with open('src/app/how-it-works/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the current glows with the new ones
old_glows = '''      {/* Deep Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3b0764]/40 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#0284c7]/30 blur-[120px] rounded-full pointer-events-none"></div>'''

new_glows = '''      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/15 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>'''

content = content.replace(old_glows, new_glows)

with open('src/app/how-it-works/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

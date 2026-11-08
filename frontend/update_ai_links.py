import os

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace /projects/new with /ai on the Bot icon links
            content = content.replace(
                'href="/projects/new" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">\n            <Bot',
                'href="/ai" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">\n            <Bot'
            )
            content = content.replace(
                'href="/projects/new" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20">\n            <Bot',
                'href="/ai" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20">\n            <Bot'
            )
            # Update CTA at the bottom if needed
            content = content.replace(
                '<Link href="/projects/new" className="w-full py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 rounded-xl text-[13px] font-semibold transition-colors flex items-center justify-center gap-1 relative z-10">\n              Try PayPilot AI &rarr;\n            </Link>',
                '<Link href="/ai" className="w-full py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 rounded-xl text-[13px] font-semibold transition-colors flex items-center justify-center gap-1 relative z-10">\n              Try PayPilot AI &rarr;\n            </Link>'
            )
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)

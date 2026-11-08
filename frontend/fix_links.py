import os

def fix_sidebar(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(
        '<button className=\"w-full bg-gradient-to-r from-blue-500 to-cyan-400',
        '<Link href=\"/projects/new\" className=\"w-full bg-gradient-to-r from-blue-500 to-cyan-400'
    )
    content = content.replace('Try AI Assistant &rarr;\n                </button>', 'Try AI Assistant &rarr;\n                </Link>')
    content = content.replace('Try AI Matching &rarr;\n              </button>', 'Try AI Matching &rarr;\n              </Link>')

    # Dashboard
    content = content.replace('href=\"#\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <Home', 'href=\"/dashboard/client\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <Home')
    # Find Freelancers
    content = content.replace('href=\"#\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <Users', 'href=\"/projects/matching\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <Users')
    # AI Assistant
    content = content.replace('href=\"#\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <Bot', 'href=\"/projects/new\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors\">\n            <Bot')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            fix_sidebar(os.path.join(root, file))

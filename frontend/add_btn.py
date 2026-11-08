import os

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'Create Project' not in content:
                content = content.replace(
                    '<span className=\"font-medium\">Dashboard</span>\n          </Link>',
                    '<span className=\"font-medium\">Dashboard</span>\n          </Link>\n          <Link href=\"/projects/new\" className=\"flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors text-blue-400\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>\n            <span className=\"font-medium\">Create Project</span>\n          </Link>'
                )
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)

import os

target_html = '''        <div className=\"p-6 flex items-center gap-3 mb-4 relative z-10\">
          <div className=\"bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2\">
            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" className=\"w-5 h-5 text-white\">
              <path fillRule=\"evenodd\" d=\"M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z\" clipRule=\"evenodd\" />
            </svg>
          </div>
          <span className=\"text-2xl font-bold text-white tracking-tight\">PayPilot</span>
        </div>'''

replacement_html = '''        <Link href=\"/dashboard/client\" className=\"p-6 flex items-center gap-3 mb-4 relative z-10 hover:opacity-90 transition-opacity\">
          <div className=\"bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2\">
            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" className=\"w-5 h-5 text-white\">
              <path fillRule=\"evenodd\" d=\"M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z\" clipRule=\"evenodd\" />
            </svg>
          </div>
          <span className=\"text-2xl font-bold text-white tracking-tight\">PayPilot</span>
        </Link>'''

count = 0
for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('page.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if target_html in content:
                content = content.replace(target_html, replacement_html)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1
                
print(f"Updated {count} files.")

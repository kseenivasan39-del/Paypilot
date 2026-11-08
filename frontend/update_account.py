import os

path = 'src/app/settings/account/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

tabs_html = '''          {/* Tabs */}
          <div className=\"bg-white rounded-2xl shadow-sm border border-slate-200 flex mb-6 px-2 overflow-hidden\">
            <Link href=\"/settings\" className=\"flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors\">
              <User className=\"w-4 h-4\" /> Profile
            </Link>
            <Link href=\"/settings/account\" className=\"flex-1 py-4 flex items-center justify-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600\">
              <SettingsIcon className=\"w-4 h-4\" /> Account
            </Link>
            <Link href=\"/settings/notifications\" className=\"flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors\">
              <Bell className=\"w-4 h-4\" /> Notifications
            </Link>
            <Link href=\"/settings/security\" className=\"flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors\">
              <Shield className=\"w-4 h-4\" /> Security
            </Link>
            <button className=\"flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors\">
              <CreditCard className=\"w-4 h-4\" /> Payments
            </button>
          </div>'''

target = '          {/* Grid Layout */}'
content = content.replace(target, tabs_html + '\n' + target)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

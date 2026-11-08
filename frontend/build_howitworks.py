import os
import re

with open('update_landing_section.py', 'r', encoding='utf-8') as f:
    script_content = f.read()

# Extract the new_section string
match = re.search(r"new_section = '''(.*?)'''", script_content, re.DOTALL)
if match:
    section_html = match.group(1)
    
    # We will build a new page component
    page_content = f'''import Link from "next/link";
import {{ ChevronDown, CheckCircle }} from "lucide-react";
import {{ ShieldCheck }} from "lucide-react";

export default function HowItWorksPage() {{
  return (
    <div className="min-h-screen bg-[#05030f] text-white font-sans overflow-x-hidden relative selection:bg-blue-500/30">
      
      {{/* Deep Background Glows */}}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3b0764]/40 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#0284c7]/30 blur-[120px] rounded-full pointer-events-none"></div>

      {{/* Navigation */}}
      <header className="relative z-20 flex justify-between items-center py-6 px-10 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2 shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">PayPilot</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-300">
          <Link href="/how-it-works" className="text-white transition-colors">How it works</Link>
          <Link href="#" className="hover:text-white transition-colors">For Clients</Link>
          <Link href="#" className="hover:text-white transition-colors">For Freelancers</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard/client" className="text-[15px] font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 border border-slate-700/50 rounded-xl">
            Sign In
          </Link>
          <Link href="/projects/new" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-xl text-[15px] font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {section_html}

    </div>
  );
}}
'''
    os.makedirs('src/app/how-it-works', exist_ok=True)
    with open('src/app/how-it-works/page.tsx', 'w', encoding='utf-8') as f:
        f.write(page_content)
    print("Created src/app/how-it-works/page.tsx successfully!")
else:
    print("Could not extract new_section")

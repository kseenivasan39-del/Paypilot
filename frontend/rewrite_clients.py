import os

page_content = '''import Link from "next/link";
import Image from "next/image";

export default function ForClientsPage() {
  return (
    <div className="min-h-screen bg-[#020513] flex flex-col items-center justify-start relative overflow-x-hidden">
      
      {/* Display the provided mock-up image as the exact UI */}
      <div className="w-full max-w-[1920px] mx-auto relative">
        <Image 
          src="/for-clients.jpg" 
          alt="PayPilot For Clients" 
          width={1920} 
          height={1280} 
          className="w-full h-auto object-contain"
          priority
        />

        {/* Invisible Click Targets to maintain functionality */}
        
        {/* Navigation */}
        <Link href="/" className="absolute top-[2%] left-[8%] w-[10%] h-[4%] z-10" aria-label="Home" />
        <Link href="/how-it-works" className="absolute top-[2%] left-[38%] w-[6%] h-[4%] z-10" aria-label="How it works" />
        <Link href="/for-clients" className="absolute top-[2%] left-[45%] w-[6%] h-[4%] z-10" aria-label="For Clients" />
        
        {/* Sign In & Get Started (assuming they are in top right like the main page, though barely visible or cut off) */}
        
        {/* Hero Buttons */}
        <Link href="/projects/new" className="absolute top-[34%] left-[8%] w-[13%] h-[5%] z-10 hover:bg-white/10 rounded-xl transition-colors" aria-label="Start a Project" />
        <Link href="/dashboard/client" className="absolute top-[34%] left-[23%] w-[13%] h-[5%] z-10 hover:bg-white/10 rounded-xl transition-colors" aria-label="Explore Freelancers" />
        
        {/* Dashboard Mockup Buttons */}
        <Link href="/dashboard/client" className="absolute top-[39%] right-[8%] w-[11%] h-[3%] z-10 hover:bg-white/10 rounded-lg transition-colors" aria-label="Find More Matches" />
        
        {/* Bottom CTA Button */}
        <Link href="/projects/new" className="absolute bottom-[4%] right-[21%] w-[13%] h-[5%] z-10 hover:bg-white/10 rounded-xl transition-colors" aria-label="Create Your Project" />

      </div>

    </div>
  );
}
'''
with open('src/app/for-clients/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)

import os

new_section = '''
      {/* How PayPilot Works Section */}
      <section className=\"relative z-20 px-8 py-24 max-w-[1600px] mx-auto border-t border-slate-800/50 mt-12 bg-[#05030f]\">
        {/* Section Header */}
        <div className=\"text-center max-w-3xl mx-auto mb-20\">
          <div className=\"flex items-center justify-center gap-3 mb-6\">
            <span className=\"text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase\">Simple</span>
            <span className=\"w-1 h-1 rounded-full bg-blue-500\"></span>
            <span className=\"text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase\">AI Powered</span>
            <span className=\"w-1 h-1 rounded-full bg-blue-500\"></span>
            <span className=\"text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase\">PayPal Secured</span>
          </div>
          <h2 className=\"text-5xl font-extrabold text-white mb-6 tracking-tight\">
            How <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500\">PayPilot</span> Works
          </h2>
          <p className=\"text-lg text-slate-400 leading-relaxed\">
            From idea to payment, all in one place. PayPilot uses AI to simplify hiring, verify work, and secure payments through PayPal.
          </p>
        </div>

        {/* 5-Step Horizontal Flow */}
        <div className=\"grid grid-cols-1 lg:grid-cols-5 gap-6 relative\">
          
          {/* Connecting Line */}
          <div className=\"hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-800 z-0\">
            <div className=\"absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 w-full opacity-50\"></div>
          </div>

          {/* Step 1 */}
          <div className=\"relative z-10 flex flex-col items-center\">
            <div className=\"w-14 h-14 rounded-full bg-[#1e1b4b] border-2 border-indigo-500 flex items-center justify-center text-xl font-bold text-indigo-400 mb-6 shadow-[0_0_15px_rgba(99,102,241,0.5)]\">1</div>
            <div className=\"bg-[#0B1120] rounded-2xl p-6 border border-slate-800 w-full mb-6 min-h-[140px]\">
              <h3 className=\"text-[17px] font-bold text-white mb-2\">Describe Your Project</h3>
              <p className=\"text-[13px] text-slate-400 leading-relaxed\">Tell us what you need in simple language. Our AI analyzes your requirements, budget and timeline.</p>
            </div>
            {/* UI Card Preview 1 */}
            <div className=\"bg-white rounded-xl p-4 w-full shadow-xl pointer-events-none transform hover:-translate-y-1 transition-transform\">
              <h4 className=\"text-slate-900 font-bold text-[13px] mb-3\">Create a New Project</h4>
              <div className=\"bg-slate-50 border border-slate-200 rounded-lg p-3 mb-2\">
                <p className=\"text-[11px] text-slate-700 leading-relaxed\">I need a 10-page technical report about solar power plants. Budget requirements, budget and timeline.</p>
              </div>
              <div className=\"text-right text-[9px] text-slate-400 mb-3\">110/500</div>
              <div className=\"mb-3\">
                <div className=\"text-[10px] font-bold text-slate-700 mb-1\">Project Type</div>
                <div className=\"border border-slate-200 rounded-md py-1.5 px-2 text-[11px] text-slate-700 flex justify-between items-center\">
                  Technical Writing <ChevronDown className=\"w-3 h-3 text-slate-400\" />
                </div>
              </div>
              <div className=\"w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-[12px] font-bold text-center\">
                Analyze with AI ✨
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className=\"relative z-10 flex flex-col items-center mt-12 lg:mt-0\">
            <div className=\"w-14 h-14 rounded-full bg-[#0c4a6e] border-2 border-cyan-500 flex items-center justify-center text-xl font-bold text-cyan-400 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]\">2</div>
            <div className=\"bg-[#0B1120] rounded-2xl p-6 border border-slate-800 w-full mb-6 min-h-[140px]\">
              <h3 className=\"text-[17px] font-bold text-white mb-2\">Find the Right Talent</h3>
              <p className=\"text-[13px] text-slate-400 leading-relaxed\">Our AI finds and ranks the best freelancers based on skills, experience and your requirements.</p>
            </div>
            {/* UI Card Preview 2 */}
            <div className=\"bg-white rounded-xl p-4 w-full shadow-xl pointer-events-none transform hover:-translate-y-1 transition-transform\">
              <h4 className=\"text-slate-900 font-bold text-[13px] mb-3\">Top Freelancer Matches</h4>
              <div className=\"space-y-2\">
                {/* Match 1 */}
                <div className=\"border border-slate-100 rounded-lg p-2 flex gap-2\">
                  <div className=\"w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden\">
                    <img src=\"https://i.pravatar.cc/150?u=rahul\" alt=\"\" className=\"w-full h-full object-cover\"/>
                  </div>
                  <div className=\"flex-1\">
                    <div className=\"flex justify-between items-start mb-0.5\">
                      <div className=\"text-[11px] font-bold text-slate-900 leading-tight\">Rahul Kumar</div>
                      <div className=\"text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded\">96% Match</div>
                    </div>
                    <div className=\"text-[9px] text-slate-500 mb-1\">Technical Writer</div>
                    <div className=\"flex justify-between items-end\">
                      <div className=\"flex gap-1\">
                        <span className=\"text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded\">Technical Writing</span>
                      </div>
                      <div className=\"text-right\">
                        <div className=\"text-[11px] font-bold text-slate-900\">₹3,000</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Match 2 */}
                <div className=\"border border-slate-100 rounded-lg p-2 flex gap-2\">
                  <div className=\"w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden\">
                    <img src=\"https://i.pravatar.cc/150?u=sneha\" alt=\"\" className=\"w-full h-full object-cover\"/>
                  </div>
                  <div className=\"flex-1\">
                    <div className=\"flex justify-between items-start mb-0.5\">
                      <div className=\"text-[11px] font-bold text-slate-900 leading-tight\">Sneha Rao</div>
                      <div className=\"text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded\">92% Match</div>
                    </div>
                    <div className=\"text-[9px] text-slate-500 mb-1\">Content Writer</div>
                    <div className=\"flex justify-between items-end\">
                      <div className=\"flex gap-1\">
                        <span className=\"text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded\">Research</span>
                      </div>
                      <div className=\"text-right\">
                        <div className=\"text-[11px] font-bold text-slate-900\">₹2,000</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Match 3 */}
                <div className=\"border border-slate-100 rounded-lg p-2 flex gap-2\">
                  <div className=\"w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden\">
                    <img src=\"https://i.pravatar.cc/150?u=arjun\" alt=\"\" className=\"w-full h-full object-cover\"/>
                  </div>
                  <div className=\"flex-1\">
                    <div className=\"flex justify-between items-start mb-0.5\">
                      <div className=\"text-[11px] font-bold text-slate-900 leading-tight\">Arjun Mehta</div>
                      <div className=\"text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded\">88% Match</div>
                    </div>
                    <div className=\"text-[9px] text-slate-500 mb-1\">Data Analyst</div>
                    <div className=\"flex justify-between items-end\">
                      <div className=\"flex gap-1\">
                        <span className=\"text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded\">Analysis</span>
                      </div>
                      <div className=\"text-right\">
                        <div className=\"text-[11px] font-bold text-slate-900\">₹2,500</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className=\"relative z-10 flex flex-col items-center mt-12 lg:mt-0\">
            <div className=\"w-14 h-14 rounded-full bg-[#1e3a8a] border-2 border-blue-500 flex items-center justify-center text-xl font-bold text-blue-400 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]\">3</div>
            <div className=\"bg-[#0B1120] rounded-2xl p-6 border border-slate-800 w-full mb-6 min-h-[140px]\">
              <h3 className=\"text-[17px] font-bold text-white mb-2\">Hire & Agree</h3>
              <p className=\"text-[13px] text-slate-400 leading-relaxed\">Review profiles, discuss details and finalize the project terms with secure PayPal payment.</p>
            </div>
            {/* UI Card Preview 3 */}
            <div className=\"bg-white rounded-xl p-4 w-full shadow-xl pointer-events-none transform hover:-translate-y-1 transition-transform\">
              <div className=\"flex justify-between items-center mb-4\">
                <h4 className=\"text-slate-900 font-bold text-[13px]\">Project Agreement</h4>
              </div>
              <div className=\"flex justify-between items-center mb-4 border-b border-slate-100 pb-3\">
                <div className=\"flex items-center gap-2\">
                  <img src=\"https://i.pravatar.cc/150?u=rahul\" alt=\"\" className=\"w-8 h-8 rounded-full\"/>
                  <div>
                    <div className=\"text-[11px] font-bold text-slate-900\">Rahul Kumar</div>
                    <div className=\"text-[9px] text-slate-500\">Technical Writer</div>
                  </div>
                </div>
                <div className=\"text-right\">
                  <div className=\"text-[9px] text-slate-500\">Project Amount</div>
                  <div className=\"text-[12px] font-bold text-slate-900\">₹3,000</div>
                </div>
              </div>
              <div className=\"space-y-3 mb-4\">
                <div className=\"flex items-start gap-2\">
                  <div className=\"w-3 h-3 rounded-full bg-blue-500 mt-0.5 shrink-0\"></div>
                  <div className=\"flex-1\">
                    <div className=\"flex justify-between\">
                      <div className=\"text-[10px] font-bold text-slate-900\">Milestone 1</div>
                      <div className=\"text-[10px] font-bold text-slate-900\">₹1,000</div>
                    </div>
                    <div className=\"text-[9px] text-slate-500\">Research and outline</div>
                  </div>
                </div>
                <div className=\"flex items-start gap-2\">
                  <div className=\"w-3 h-3 rounded-full border-2 border-slate-300 mt-0.5 shrink-0\"></div>
                  <div className=\"flex-1\">
                    <div className=\"flex justify-between\">
                      <div className=\"text-[10px] font-bold text-slate-900\">Milestone 2</div>
                      <div className=\"text-[10px] font-bold text-slate-900\">₹1,000</div>
                    </div>
                    <div className=\"text-[9px] text-slate-500\">Draft report</div>
                  </div>
                </div>
                <div className=\"flex items-start gap-2\">
                  <div className=\"w-3 h-3 rounded-full border-2 border-slate-300 mt-0.5 shrink-0\"></div>
                  <div className=\"flex-1\">
                    <div className=\"flex justify-between\">
                      <div className=\"text-[10px] font-bold text-slate-900\">Milestone 3</div>
                      <div className=\"text-[10px] font-bold text-slate-900\">₹1,000</div>
                    </div>
                    <div className=\"text-[9px] text-slate-500\">Final revisions</div>
                  </div>
                </div>
              </div>
              <div className=\"bg-blue-50 rounded-lg p-2.5 flex gap-2 items-center mb-3\">
                <span className=\"text-blue-600 font-bold italic tracking-tighter shrink-0\">P</span>
                <div>
                  <div className=\"text-[10px] font-bold text-blue-900\">Secure Payment with PayPal</div>
                  <div className=\"text-[9px] text-blue-700\">Funds are processed securely.</div>
                </div>
              </div>
              <div className=\"w-full py-2 bg-blue-600 text-white rounded-lg text-[12px] font-bold text-center\">
                Proceed to Pay with PayPal
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className=\"relative z-10 flex flex-col items-center mt-12 lg:mt-0\">
            <div className=\"w-14 h-14 rounded-full bg-[#0369a1] border-2 border-sky-400 flex items-center justify-center text-xl font-bold text-sky-300 mb-6 shadow-[0_0_15px_rgba(56,189,248,0.5)]\">4</div>
            <div className=\"bg-[#0B1120] rounded-2xl p-6 border border-slate-800 w-full mb-6 min-h-[140px]\">
              <h3 className=\"text-[17px] font-bold text-white mb-2\">Track & Verify Work</h3>
              <p className=\"text-[13px] text-slate-400 leading-relaxed\">The freelancer completes the work and our AI verifies the deliverables against your requirements.</p>
            </div>
            {/* UI Card Preview 4 */}
            <div className=\"bg-white rounded-xl p-4 w-full shadow-xl pointer-events-none transform hover:-translate-y-1 transition-transform\">
              <h4 className=\"text-slate-900 font-bold text-[13px] mb-4 text-center\">AI Deliverable Verification</h4>
              
              <div className=\"flex justify-center mb-4\">
                <div className=\"relative w-16 h-16 flex items-center justify-center\">
                  <svg className=\"w-full h-full transform -rotate-90\" viewBox=\"0 0 36 36\">
                    <path strokeDasharray=\"100, 100\" d=\"M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831\" fill=\"none\" stroke=\"#E2E8F0\" strokeWidth=\"3\" />
                    <path strokeDasharray=\"96, 100\" d=\"M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831\" fill=\"none\" stroke=\"#10B981\" strokeWidth=\"3\" />
                  </svg>
                  <div className=\"absolute flex flex-col items-center justify-center\">
                    <span className=\"text-[14px] font-extrabold text-slate-900 leading-none\">96%</span>
                  </div>
                </div>
              </div>

              <div className=\"space-y-2 mb-4\">
                <div className=\"flex justify-between items-center\">
                  <div className=\"flex items-center gap-1.5\">
                    <CheckCircle className=\"w-3 h-3 text-emerald-500\" />
                    <span className=\"text-[10px] text-slate-600 font-medium\">Requirements Match</span>
                  </div>
                  <span className=\"text-[10px] font-bold text-emerald-600\">100%</span>
                </div>
                <div className=\"flex justify-between items-center\">
                  <div className=\"flex items-center gap-1.5\">
                    <CheckCircle className=\"w-3 h-3 text-emerald-500\" />
                    <span className=\"text-[10px] text-slate-600 font-medium\">Content Quality</span>
                  </div>
                  <span className=\"text-[10px] font-bold text-emerald-600\">94%</span>
                </div>
                <div className=\"flex justify-between items-center\">
                  <div className=\"flex items-center gap-1.5\">
                    <CheckCircle className=\"w-3 h-3 text-emerald-500\" />
                    <span className=\"text-[10px] text-slate-600 font-medium\">Technical Accuracy</span>
                  </div>
                  <span className=\"text-[10px] font-bold text-emerald-600\">95%</span>
                </div>
              </div>

              <div className=\"bg-emerald-50 rounded-lg p-2.5 flex items-start gap-2 mb-3\">
                <CheckCircle className=\"w-4 h-4 text-emerald-600 shrink-0 mt-0.5\" />
                <div>
                  <div className=\"text-[10px] font-bold text-emerald-900\">Work meets requirements</div>
                  <div className=\"text-[9px] text-emerald-700\">Ready for your review.</div>
                </div>
              </div>

              <div className=\"flex gap-2\">
                <div className=\"flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold text-center\">
                  Request Revision
                </div>
                <div className=\"flex-1 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold text-center\">
                  Approve & Release
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className=\"relative z-10 flex flex-col items-center mt-12 lg:mt-0\">
            <div className=\"w-14 h-14 rounded-full bg-[#4c1d95] border-2 border-purple-500 flex items-center justify-center text-xl font-bold text-purple-400 mb-6 shadow-[0_0_15px_rgba(168,85,247,0.5)]\">5</div>
            <div className=\"bg-[#0B1120] rounded-2xl p-6 border border-slate-800 w-full mb-6 min-h-[140px]\">
              <h3 className=\"text-[17px] font-bold text-white mb-2\">Get Work Done</h3>
              <p className=\"text-[13px] text-slate-400 leading-relaxed\">Once you approve the work, payment is released to the freelancer via PayPal.</p>
            </div>
            {/* UI Card Preview 5 */}
            <div className=\"bg-white rounded-xl p-4 w-full shadow-xl pointer-events-none transform hover:-translate-y-1 transition-transform\">
              <h4 className=\"text-slate-900 font-bold text-[13px] mb-4\">Payment Completed</h4>
              
              <div className=\"flex flex-col items-center mb-4\">
                <div className=\"w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3\">
                  <CheckCircle className=\"w-6 h-6 text-emerald-600\" />
                </div>
                <h5 className=\"text-[14px] font-bold text-slate-900 mb-1\">Payment Released!</h5>
                <p className=\"text-[10px] text-slate-500 text-center leading-relaxed px-2\">
                  ₹3,000 has been successfully sent to Rahul Kumar via PayPal.
                </p>
              </div>

              <div className=\"bg-slate-50 border border-slate-100 rounded-lg p-3 mb-4\">
                <div className=\"flex justify-between items-center mb-2\">
                  <span className=\"text-[9px] text-slate-500\">Transaction ID</span>
                  <span className=\"text-[10px] font-bold text-slate-900\">PP-1001</span>
                </div>
                <div className=\"flex justify-between items-center mb-2\">
                  <span className=\"text-[9px] text-slate-500\">Date</span>
                  <span className=\"text-[10px] font-bold text-slate-900\">Oct 6, 2026</span>
                </div>
                <div className=\"flex justify-between items-center\">
                  <span className=\"text-[9px] text-slate-500\">Status</span>
                  <span className=\"text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded\">Completed</span>
                </div>
              </div>

              <div className=\"w-full py-2 border border-blue-200 text-blue-600 rounded-lg text-[11px] font-bold text-center\">
                View Transaction Details
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Feature Row */}
        <div className=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-20\">
          <div className=\"bg-[#0B1120] border border-slate-800 rounded-2xl p-5 flex items-center gap-4\">
            <div className=\"w-12 h-12 bg-[#2e1065] rounded-xl flex items-center justify-center shrink-0\">
              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\" className=\"text-purple-400\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon></svg>
            </div>
            <div>
              <h4 className=\"text-white font-bold text-[14px]\">AI Powered</h4>
              <p className=\"text-[11px] text-slate-400 mt-0.5 leading-relaxed\">Smarter matching and deliverable verification</p>
            </div>
          </div>

          <div className=\"bg-[#0B1120] border border-slate-800 rounded-2xl p-5 flex items-center gap-4\">
            <div className=\"w-12 h-12 bg-[#0c4a6e] rounded-xl flex items-center justify-center shrink-0\">
              <span className=\"font-bold text-xl text-blue-400 italic tracking-tighter pr-1\">P</span>
            </div>
            <div>
              <h4 className=\"text-white font-bold text-[14px]\">PayPal Secured</h4>
              <p className=\"text-[11px] text-slate-400 mt-0.5 leading-relaxed\">Safe and reliable payment processing</p>
            </div>
          </div>

          <div className=\"bg-[#0B1120] border border-slate-800 rounded-2xl p-5 flex items-center gap-4\">
            <div className=\"w-12 h-12 bg-[#064e3b] rounded-xl flex items-center justify-center shrink-0\">
              <ShieldCheck className=\"w-5 h-5 text-emerald-400\" />
            </div>
            <div>
              <h4 className=\"text-white font-bold text-[14px]\">Transparent Process</h4>
              <p className=\"text-[11px] text-slate-400 mt-0.5 leading-relaxed\">Track every step from hiring to payment</p>
            </div>
          </div>

          <div className=\"bg-[#0B1120] border border-slate-800 rounded-2xl p-5 flex items-center gap-4\">
            <div className=\"w-12 h-12 bg-[#1e1b4b] rounded-xl flex items-center justify-center shrink-0\">
              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\" className=\"text-indigo-400\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline></svg>
            </div>
            <div>
              <h4 className=\"text-white font-bold text-[14px]\">Faster Results</h4>
              <p className=\"text-[11px] text-slate-400 mt-0.5 leading-relaxed\">Get quality work done quickly and efficiently</p>
            </div>
          </div>
        </div>

      </section>
'''

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure ChevronDown is imported
if 'ChevronDown' not in content:
    content = content.replace('import { ArrowRight, Sparkles, UserPlus, Users, FileText, CheckCircle, ShieldCheck, DollarSign, Star, Briefcase } from "lucide-react";', 
                              'import { ArrowRight, Sparkles, UserPlus, Users, FileText, CheckCircle, ShieldCheck, DollarSign, Star, Briefcase, ChevronDown } from "lucide-react";')

content = content.replace('    </div>\n  );\n}\n', new_section + '\n    </div>\n  );\n}\n')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added new section successfully.")

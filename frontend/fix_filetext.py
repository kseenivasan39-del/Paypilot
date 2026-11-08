import os

with open('src/app/for-freelancers/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { ArrowRight, CheckCircle2, Target, ShieldCheck, BarChart2, Clock, Zap, Shield, ChevronDown } from "lucide-react";',
    'import { ArrowRight, CheckCircle2, Target, ShieldCheck, BarChart2, Clock, Zap, Shield, ChevronDown, FileText } from "lucide-react";'
)

with open('src/app/for-freelancers/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import json
import re

with open(r'C:\Users\kseen\.gemini\antigravity\brain\fd7e31c4-0feb-4eba-9e21-3f003a062766\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in reversed(list(f)):
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and 'tool_calls' in data:
                for call in data['tool_calls']:
                    if call['name'] == 'write_to_file' and 'page.tsx' in str(call['args'].get('TargetFile', '')):
                        if 'LandingPage' in call['args'].get('CodeContent', ''):
                            with open('src/app/page.tsx', 'w', encoding='utf-8') as out:
                                out.write(call['args']['CodeContent'])
                            print("Restored from write_to_file!")
                            exit(0)
                    if call['name'] == 'replace_file_content' and 'page.tsx' in str(call['args'].get('TargetFile', '')):
                        # this might be too complex to piece together, but let's just see if we can find the full write
                        pass
        except:
            pass

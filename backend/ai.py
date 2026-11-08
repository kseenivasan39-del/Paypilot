import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
import re

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

AI_API_KEY = os.getenv("AI_API_KEY")
if AI_API_KEY:
    genai.configure(api_key=AI_API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')

def extract_project_requirements(description: str):
    prompt = f"""
    Analyze the following project description and extract the key requirements.
    Return a JSON object with exactly these keys:
    - extracted_skills (string, comma separated)
    - deliverables (string, text description)
    - complexity (string, one of: Low, Medium, High)
    
    Description:
    {description}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return {"extracted_skills": "", "deliverables": "", "complexity": "Medium"}
    except Exception as e:
        print(f"AI extraction error: {e}")
        return {"extracted_skills": "", "deliverables": "Failed to extract", "complexity": "Medium"}

def assess_risk(amount: float, client_id: int, freelancer_id: int):
    prompt = f"Assess the risk of a transaction of {amount} between client {client_id} and freelancer {freelancer_id}. Return only a float between 0.0 and 1.0 where 1.0 is high risk."
    try:
        response = model.generate_content(prompt)
        score = float(response.text.strip())
        return min(max(score, 0.0), 1.0)
    except:
        return 0.1

import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
api_key = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=api_key)

models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
for m in sorted(models):
    print(m)

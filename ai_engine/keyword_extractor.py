import google.generativeai as genai
from django.conf import settings
import json

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


KEYWORD_EXTRACTION_PROMPT = """
You are an AI document analyzer.

Extract the 10 most important keywords from the document.

Rules:
- Return ONLY a valid JSON array.
- No explanation.
- No markdown.
- Maximum 10 keywords.

Example:

[
    "Python",
    "SQL",
    "Django"
]

Document:

{text}
"""


def extract_keywords(document_text):
    prompt = KEYWORD_EXTRACTION_PROMPT.format(text=document_text)

    response = model.generate_content(prompt)

    try:
        return json.loads(response.text)
    except Exception:
        return []
from .client import model
import json




DOCUMENT_ANALYSIS_PROMPT = """
You are an expert AI document analyst.

Analyze the document and return ONLY a valid JSON object.

Format:

{{
    "insights": "Write 4-5 lines highlighting important observations.",
    "recommendations": "Write 4-5 practical recommendations."
}}

Rules:
- Return ONLY JSON.
- No markdown.
- No explanation.

Document:

{text}
"""


def analyze_document(document_text):

    prompt = DOCUMENT_ANALYSIS_PROMPT.format(
        text=document_text
    )

    response = model.generate_content(prompt)

    try:
        return json.loads(response.text)
    except Exception:
        return {
            "insights": "",
            "recommendations": ""
        }
import json

from google.api_core.exceptions import ResourceExhausted

from ai_engine.client import model


def process_document(document_text):
    """
    Process the document using a single Gemini API call.
    """

    prompt = f"""
You are an AI document analysis assistant.

Analyze the following document and return ONLY valid JSON.

Return in exactly this format:

{{
    "summary": "...",
    "category": "...",
    "keywords": [
        "...",
        "...",
        "..."
    ],
    "insights": "...",
    "recommendations": "..."
}}

Rules:
- Do not write markdown.
- Do not use ```json.
- Return ONLY JSON.
- Keywords should be a list of 8-10 important keywords.

Document:

{document_text}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()
        elif text.startswith("```"):
            text = text.replace("```", "").strip()

        data = json.loads(text)

        # Success
        data["error"] = False

        return data

    except ResourceExhausted:
        return {
            "error": True,
            "summary": "",
            "category": "",
            "keywords": [],
            "insights": "Gemini API quota exceeded. Please try again later.",
            "recommendations": "Please retry after the quota resets."
        }
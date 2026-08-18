import json


from ai_engine.client import client


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
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()
        elif text.startswith("```"):
            text = text.replace("```", "").strip()

        data = json.loads(text)

        # Success
        data["error"] = False

        return data

    except Exception as e:
        print("Gemini Error:", e)

        return {
            "error": True,
            "summary": "",
            "category": "",
            "keywords": [],
            "insights": "Gemini API error. Please try again later.",
            "recommendations": "Please retry later."
        }
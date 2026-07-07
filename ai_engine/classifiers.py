import google.generativeai as genai

from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


DOCUMENT_CLASSIFICATION_PROMPT = """
You are an AI document classifier.

Classify the following document into ONLY ONE of these categories.

Categories:

- Resume
- Research Paper
- Invoice
- Legal Contract
- Financial Report
- Business Proposal
- Medical Report
- Other

Rules:
- Return ONLY the category name.
- Do not explain.
- Do not add extra text.

Document:

{text}
"""


def classify_document(document_text):

    prompt = DOCUMENT_CLASSIFICATION_PROMPT.format(
        text=document_text
    )

    response = model.generate_content(prompt)

    return response.text.strip()
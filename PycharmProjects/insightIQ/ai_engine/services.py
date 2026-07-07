import google.generativeai as genai

from django.conf import settings

from .prompts import SUMMARY_PROMPT

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_summary(document_text):

    prompt = SUMMARY_PROMPT.format(
        text=document_text
    )

    response = model.generate_content(prompt)

    return response.text
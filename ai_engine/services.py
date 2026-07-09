from .prompts import SUMMARY_PROMPT
from .client import model



def generate_summary(document_text):

    prompt = SUMMARY_PROMPT.format(
        text=document_text
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        print(e)
        return ""
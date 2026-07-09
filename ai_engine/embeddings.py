from google import genai

from django.conf import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_embedding(text):

    response = client.models.embed_content(
        model="text-embedding-004",
        contents=text
    )

    return response.embeddings[0].values
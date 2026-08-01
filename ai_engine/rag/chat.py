from ai_engine.client import client
from .retriever import retrieve_chunks


def chat_with_document(question, document_id):

    print("Entered chat_with_document")

    chunks = retrieve_chunks(question, document_id)

    if not chunks:
        return "I could not find that information in the uploaded document."

    print("Chunks:", chunks)

    context = "\n\n".join(chunks)

    print("Context length:", len(context))

    prompt = f"""
You are an AI assistant that answers questions ONLY from the provided document.

Rules:
- Answer ONLY from the provided context.
- Never use outside knowledge.
- Never guess or fabricate information.
- If the answer is not available in the context, reply EXACTLY with:
"I could not find that information in the uploaded document."
- Keep answers concise and easy to understand.

Context:
{context}

Question:
{question}

Answer:
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text.strip()

    except Exception as e:
        print("Gemini Error:", e)

        return "Sorry, I couldn't generate a response right now."
from ai_engine.client import model
from .retriever import retrieve_chunks

def chat_with_document(question, document_id):

    chunks = retrieve_chunks(question, document_id)

    context = "\n\n".join(chunks)

    prompt = f"""
You are an AI assistant that answers questions based ONLY on the provided document context.

Rules:
- Answer only from the context below.
- Do not make assumptions.
- If the answer is not available in the context, reply:
"I could not find that information in the uploaded document."
- Keep the answer clear and concise.

Context:
{context}

Question:
{question}

Answer:
"""

    response = model.generate_content(prompt)

    return response.text.strip()
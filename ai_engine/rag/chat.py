from ai_engine.client import client

from .retriever import retrieve_chunks

from documents.models import Document


FALLBACK_MESSAGE = (
    "I could not find that information in the uploaded document."
)


def chat_with_document(question, document_id):

    # ==========================================
    # GET DOCUMENT
    # ==========================================

    try:

        document = Document.objects.get(
            id=document_id
        )

    except Document.DoesNotExist:

        return FALLBACK_MESSAGE

    # ==========================================
    # RETRIEVE RELEVANT CHUNKS
    # ==========================================

    chunks = retrieve_chunks(
        question,
        document_id,
        k=5
    )

    if not chunks:

        return FALLBACK_MESSAGE

    context = "\n\n---\n\n".join(
        chunks
    )

    # ==========================================
    # DOCUMENT INFORMATION
    # ==========================================

    document_name = document.title

    document_summary = (
        document.summary or ""
    )

    # ==========================================
    # AI PROMPT
    # ==========================================

    prompt = f"""
You are an AI assistant answering questions about ONE
specific uploaded document.

The uploaded document itself is the PRIMARY SUBJECT.

IMPORTANT:
The document may mention other books, people, companies,
projects, characters, or documents. Do NOT confuse something
mentioned inside the document with the uploaded document itself.

You have three sources:

1. DOCUMENT METADATA
2. DOCUMENT SUMMARY
3. RETRIEVED DOCUMENT CONTENT

Use them together.

STRICT RULES:

- Answer only using the provided document information.
- Do not use outside knowledge.
- Do not invent or guess facts.
- The uploaded document is the main subject.
- If the document mentions another work, do not treat that
  work as the uploaded document.
- For broad questions such as "What is this book about?",
  summarize the uploaded document itself.
- If the answer is not supported by the provided information,
  reply exactly:

"I could not find that information in the uploaded document."

- Keep the answer concise and clear.

========================================
DOCUMENT METADATA
========================================

Document name:
{document_name}

========================================
DOCUMENT SUMMARY
========================================

{document_summary}

========================================
RETRIEVED DOCUMENT CONTENT
========================================

{context}

========================================
QUESTION
========================================

{question}

========================================
ANSWER
========================================
"""

    # ==========================================
    # GEMINI
    # ==========================================

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        answer = response.text.strip()

        if not answer:

            return FALLBACK_MESSAGE

        return answer

    except Exception as e:

        print(
            "Gemini Error:",
            e
        )

        return (
            "Sorry, I couldn't generate a response right now."
        ) 
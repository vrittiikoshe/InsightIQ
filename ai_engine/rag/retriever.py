from .vector_store import collection
from .embeddings import generate_embedding


def retrieve_chunks(question, document_id, k=5):
    """
    Retrieve relevant chunks from a specific document.
    """

    # ==========================================
    # SEMANTIC SEARCH
    # ==========================================

    question_embedding = generate_embedding(
        question
    )

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=k,
        where={
            "document_id": document_id
        },
        include=[
            "documents",
            "distances",
            "metadatas",
        ],
    )

    semantic_chunks = results.get(
        "documents",
        [[]]
    )[0]

    # ==========================================
    # GET FIRST CHUNK
    # ==========================================

    document_chunks = collection.get(
        where={
            "document_id": document_id
        },
        include=[
            "documents",
            "metadatas",
        ],
    )

    first_chunk = None

    documents = document_chunks.get(
        "documents",
        []
    )

    metadatas = document_chunks.get(
        "metadatas",
        []
    )

    for document, metadata in zip(
        documents,
        metadatas
    ):

        if metadata.get("chunk") == 0:

            first_chunk = document
            break

    # ==========================================
    # COMBINE RESULTS
    # ==========================================

    combined_chunks = []

    if first_chunk:
        combined_chunks.append(
            first_chunk
        )

    combined_chunks.extend(
        semantic_chunks
    )

    # ==========================================
    # REMOVE DUPLICATES
    # ==========================================

    unique_chunks = []

    for chunk in combined_chunks:

        if chunk not in unique_chunks:

            unique_chunks.append(
                chunk
            )

    return unique_chunks[:k + 1] 
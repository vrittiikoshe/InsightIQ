from .vector_store import collection
from .embeddings import generate_embedding


def retrieve_chunks(question, document_id, k=3):
    """
    Retrieve the most relevant chunks for a question.
    """

    question_embedding = generate_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=k,
        where={"document_id": document_id}
    )

    return results["documents"][0]
from langchain_community.embeddings import HuggingFaceEmbeddings

_embeddings = None


def get_embeddings():
    global _embeddings

    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

    return _embeddings


def generate_embedding(text):
    embeddings = get_embeddings()
    return embeddings.embed_query(text)



import chromadb

client = chromadb.PersistentClient(path="./chromadb")

collection = client.get_or_create_collection(
    name="documents"
)
from .embeddings import generate_embedding


def add_document(document_id, chunks):

    ids = []
    embeddings = []
    metadatas = []

    for i, chunk in enumerate(chunks):

        ids.append(f"{document_id}_{i}")

        embeddings.append(
            generate_embedding(chunk)
        )

        metadatas.append({

            "document_id": document_id,

            "chunk": i

        })

    collection.add(

        ids=ids,

        embeddings=embeddings,

        documents=chunks,

        metadatas=metadatas

    )
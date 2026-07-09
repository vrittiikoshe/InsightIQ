from langchain_text_splitters import RecursiveCharacterTextSplitter


text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)


def split_document(document_text):
    """
    Split a long document into overlapping chunks.
    """

    chunks = text_splitter.split_text(document_text)

    return chunks
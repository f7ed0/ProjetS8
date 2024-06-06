import chromadb
import torch
from tika import parser
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import Chroma
from pypdf import PdfReader
import os
import shutil


embedder = HuggingFaceBgeEmbeddings(
    model_name='sentence-Transformers/all-MiniLM-l6-v2',
    model_kwargs={"device" : "cuda" if torch.cuda.is_available() else "cpu"},
    encode_kwargs={"normalize_embeddings" : False}
)

txt_splitter = CharacterTextSplitter(chunk_size=1500, chunk_overlap=500, separator="\n")

def load_pdf(path:str) -> list[str] :
    t = PdfReader(path)
    return '\n'.join([page.extract_text() for page in t.pages[1:]])
    #return parser.from_file(path)["content"]

def split_paragraph(text) :
    return txt_splitter.create_documents([text])

def embedding_dryrun(splitted_text):
    chunks = [sp.page_content for sp in splitted_text]
    embeded = embedder.embed_documents(chunks)
    #print(len(embeded))



def loadEmbededDB() :
    return Chroma(embedding_function=embedder,persist_directory="./chromadb")

if __name__ == '__main__':
    try:
        shutil.rmtree("./chromadb")
    except:
        print("No db dir, creating it.")
    os.mkdir("./chromadb")

    def embeding(splitted):
        return Chroma.from_documents(splitted,embedder,persist_directory="./chromadb")

    dump = load_pdf('docs/eb4ca340-c217-4bbd-939b-92307eb908b6.pdf')
    print(dump)
    splitted = split_paragraph(dump)
    print("STARTING EMBEDDING...")
    #print(splitted[0])
    chromadb = embeding(splitted)
    #chromadb = loadEmbededDB()
    #print("STARTING SIMILARITY SEARCH...")
    #docs = chromadb.similarity_search("C'est quoi l'UPHF ?")
    #print("RESULT : ")
    #print(docs)

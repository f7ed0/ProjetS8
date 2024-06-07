import chromadb
import torch
from tika import parser
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import Chroma
from pypdf import PdfReader

from transformers import pipeline
import os
import shutil
import csv2txt
import glob

device = "cuda" if torch.cuda.is_available() else "cpu"

sumarry_pipeline = pipeline("summarization", model="Falconsai/text_summarization", device=device, max_length=300)
#sumarry_pipeline = pipeline("summarization", model="transformer3/H2-keywordextractor", max_length=150, device=device)

embedder = HuggingFaceBgeEmbeddings(
    model_name='sentence-Transformers/all-MiniLM-l6-v2',
    model_kwargs={"device" : "cuda" if torch.cuda.is_available() else "cpu"},
    encode_kwargs={"normalize_embeddings" : False}
)

txt_splitter = CharacterTextSplitter(chunk_size=1200, chunk_overlap=600, separator="\n")

def load_pdf(path:str) -> list[str] :
    t = PdfReader(path)
    return '\n'.join([page.extract_text() for page in t.pages[1 if len(t.pages) > 3 else 0:]])
    #return parser.from_file(path)["content"]

def split_paragraph(text) -> Document :
    return txt_splitter.create_documents([text])

def sumarrized_embeding(splitted,cdb:Chroma|None) -> Chroma:
    summary = sumarry_pipeline([it for it in splitted if len(it) > 450])
    if cdb==None :
        return Chroma.from_documents([Document(page_content=it['summary_text']) for it in summary],embedder,persist_directory="./chromadb")
    else :
        return cdb.from_documents([Document(page_content=it['summary_text']) for it in summary],embedder,persist_directory="./chromadb")
    
def embeding(texts,cdb:Chroma|None):
    if cdb==None :
        return Chroma.from_documents([Document(page_content=txt) for txt in texts],embedder,persist_directory="./chromadb")
    else :
        return cdb.from_documents([Document(page_content=txt) for txt in texts],embedder,persist_directory="./chromadb")

def loadEmbededDB() :
    return Chroma(embedding_function=embedder,persist_directory="./chromadb")

if __name__ == '__main__':
    try:
        shutil.rmtree("./chromadb")
    except:
        print("No db dir, creating it.")
    os.mkdir("./chromadb")

    NoSum = []
    Sum = pdf_files = [it.replace("\\","/") for it in glob.glob(os.path.join("docs",'*.pdf'))]

    print(Sum)

    cdb = loadEmbededDB()
    print("STARTING EMBEDDING...")
    print("Statring plain...")
    for i,doc in enumerate(NoSum) :
       print("doc",i,"of",len(NoSum),"      ",end="\r")
       cdb = embeding(doc,cdb)
    print("done.\nStatring summaring...")
    for i,doc in enumerate(Sum) :
        print("doc",i,"of",len(Sum),"      ",end="\r")
        txt = load_pdf(doc)
        if len(txt) < 1000:
            continue
        chunks = split_paragraph(txt)
        cdb = sumarrized_embeding([chunk.page_content for chunk in chunks],cdb)
    print("done")

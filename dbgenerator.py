import chromadb
import torch
from tika import parser
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import Chroma
from pypdf import PdfReader

from transformers import pipeline
import os
import shutil
import csv2txt
import glob

device = "cuda" if torch.cuda.is_available() else "cpu"

embedder_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
#embedder_name = "sentence-Transformers/all-MiniLM-l6-v2"

#sumarry_pipeline = pipeline("summarization", model="transformer3/H2-keywordextractor", max_length=150, device=device)

embedder = HuggingFaceBgeEmbeddings(
    model_name=embedder_name,
    model_kwargs={"device" : "cuda" if torch.cuda.is_available() else "cpu"},
    encode_kwargs={"normalize_embeddings" : True}
)

txt_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=500, separators=["\n\n","\n",".",";","\t"," ",""])

def load_pdf(path:str) -> list[str] :
    t = PdfReader(path)
    return '\n'.join([page.extract_text() for page in t.pages[1 if len(t.pages) > 3 else 0:]])
    #return parser.from_file(path)["content"]

def split_paragraph(text) -> Document :
    return txt_splitter.create_documents([text])

def loadEmbededDB() :
    return Chroma(embedding_function=embedder,persist_directory="./chromadb")

def load_txt(path):
    with open(path,"r",encoding="UTF-8") as f:
        return f.read()

if __name__ == '__main__':
    sumarry_pipeline = pipeline("summarization", model="Falconsai/text_summarization", device=device, max_length=300)

    def sumarrized_embeding(splitted,cdb:Chroma|None) -> Chroma:
        summary = sumarry_pipeline([it for it in splitted if len(it) > 200])
        if(len(summary) == 0):
            return
        if cdb==None :
            return Chroma.from_documents([Document(page_content=it['summary_text']) for it in summary],embedder,persist_directory="./chromadb")
        else :
            return cdb.from_documents([Document(page_content=it['summary_text']) for it in summary],embedder,persist_directory="./chromadb")
    
    def embeding(texts,cdb:Chroma|None):
        if len(texts) == 0:
            return
        if cdb==None :
            return Chroma.from_documents([Document(page_content=txt) for txt in texts],embedder,persist_directory="./chromadb")
        else :
            return cdb.from_documents([Document(page_content=txt) for txt in texts],embedder,persist_directory="./chromadb")

    try:
        shutil.rmtree("./chromadb")
    except:
        print("No db dir, creating it.")
    os.mkdir("./chromadb")

    NoSum = []
    txt_files =  [it.replace("\\","/") for it in glob.glob(os.path.join("docs",'*.txt'))]
    pdf_files = []# [it.replace("\\","/") for it in glob.glob(os.path.join("docs",'*.pdf'))]
    tuned_files = [it.replace("\\","/") for it in glob.glob(os.path.join("feedbacks",'*.txt'))]

    cdb = loadEmbededDB()
    print("STARTING EMBEDDING...")
    print("Statring plain...")
    for i,doc in enumerate(NoSum) :
       print("\rdoc",i+1,"of",len(NoSum),"      ",end="")
       cdb = embeding(doc,cdb)
    print("done.               \nStatring pdfs...")
    for i,doc in enumerate(pdf_files) :
        print("\rdoc",i,"of",len(pdf_files),"      ",end="")
        txt = load_pdf(doc)
        if len(txt) < 200:
            continue
        chunks = split_paragraph(txt)
        cdb = embeding([chunk.page_content for chunk in chunks],cdb)
    print("done.             \nStatring txts...")
    for i,doc in enumerate(txt_files) :
        print("\rdoc",i+1,"of",len(txt_files),"      ",end="")
        txt = load_txt(doc)
        if len(txt) < 200:
            #print("passed")
            continue
        chunks = split_paragraph(txt)
        cdb = embeding([chunk.page_content for chunk in chunks],cdb)
        #cdb = embeding([txt],cdb)
    print("done.             \nStatring tuned...")
    for i,doc in enumerate(tuned_files) :
        print("\rdoc",i+1,"of",len(tuned_files),"      ",end="")
        txt = load_txt(doc)
        cdb = embeding([txt],cdb)
    print("done.         ")

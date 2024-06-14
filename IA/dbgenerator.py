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
import glob

device = "cuda" if torch.cuda.is_available() else "cpu"

embedder_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

embedder = HuggingFaceBgeEmbeddings(
    model_name=embedder_name,
    model_kwargs={"device" : "cuda" if torch.cuda.is_available() else "cpu"},
    encode_kwargs={"normalize_embeddings" : True}
)

txt_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=400, separators=["\n\n","\n",".",";","\t"," ",""])

def load_pdf(path:str) -> list[str] :
    t = PdfReader(path)
    return '\n'.join([page.extract_text() for page in t.pages[1 if len(t.pages) > 3 else 0:]])

def split_paragraph(text) -> Document :
    return txt_splitter.create_documents([text])

def loadEmbededDB() :
    return [Chroma(embedding_function=embedder,persist_directory="./chromadb/tuned"),Chroma(embedding_function=embedder,persist_directory="./chromadb/default")]

def load_txt(path):
    with open(path,"r",encoding="UTF-8") as f:
        return f.read()

if __name__ == '__main__':
    kw = pipeline("text2text-generation", model="ilsilfverskiold/tech-keywords-extractor", torch_dtype=torch.bfloat16, device_map="cuda",max_new_tokens=300)
    # kw = pipeline("summarization", model="transformer3/H2-keywordextractor", device_map="cuda", max_length=170)
    
    def embeding(texts,dir="default"):
        if len(texts) == 0:
            return
        docs = [Document(page_content=kw(txt)[0]['generated_text'],metadata={"text" : txt}) for txt in texts]
        #print(docs)
        return Chroma.from_documents(docs,embedder,persist_directory=f"./chromadb/{dir}")

    try:
        shutil.rmtree("./chromadb")
    except:
        print("No db dir, creating it.")
    os.mkdir("./chromadb")

    NoSum = []
    txt_files =  [it.replace("\\","/") for it in glob.glob(os.path.join("docs",'*.txt'))]
    pdf_files = [] #[it.replace("\\","/") for it in glob.glob(os.path.join("docs",'*.pdf'))]
    tuned_files = [it.replace("\\","/") for it in glob.glob(os.path.join("feedbacks",'*.txt'))]
    scrapped_files = [it.replace("\\","/") for it in glob.glob(os.path.join("scrapped",'*.txt'))]

    print("STARTING EMBEDDING...")
    print("Statring plain...")
    for i,doc in enumerate(NoSum) :
       print("\rdoc",i+1,"of",len(NoSum),"      ",end="", flush=True)
       cdb = embeding(doc)
    print("done.               \nStatring pdfs...")

    for i,doc in enumerate(pdf_files) :
        print("\rdoc",i,"of",len(pdf_files),"      ",end="", flush=True)
        txt = load_pdf(doc)
        if len(txt) < 200:
            continue
        chunks = split_paragraph(txt)
        cdb = embeding([chunk.page_content for chunk in chunks])
    print("done.             \nStatring txts...")

    for i,doc in enumerate(txt_files) :
        print("\rdoc",i+1,"of",len(txt_files),"      ",end="",flush=True)
        txt = load_txt(doc)
        if len(txt) < 200:
            continue
        chunks = split_paragraph(txt)
        cdb = embeding([chunk.page_content for chunk in chunks])
    print("done.             \nStatring tuned...")

    for i,doc in enumerate(tuned_files) :
        print("\rdoc",i+1,"of",len(tuned_files),"      ",end="",flush=True)
        txt = load_txt(doc)
        cdb = embeding([txt],"tuned")
    print("done.             \nStatring scrapped...")

    for i,doc in enumerate(scrapped_files) :
        print("\rdoc",i+1,"of",len(scrapped_files),"      ",end="",flush=True)
        txt = load_txt(doc)
        if(len(txt) < 500):
            continue
        chunks = split_paragraph(txt)
        cdb = embeding([chunk.page_content for chunk in chunks])
    print("done.         ")

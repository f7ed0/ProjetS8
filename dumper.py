from transformers import pipeline
from langchain.text_splitter import CharacterTextSplitter

sumarry_pipeline = pipeline("summarization", model="Falconsai/text_summarization", device="cuda", max_length=300)

with open("docs/wikipedia.txt","r") as f:
    txt_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=600, separator="\n")
    print("\n".join([j["summary_text"] for j in sumarry_pipeline([i.page_content for i in txt_splitter.create_documents([f.read()])])]))
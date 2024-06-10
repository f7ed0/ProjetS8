import time
from transformers import pipeline
from langchain_community.vectorstores import Chroma
import dbgenerator
from langchain_community.vectorstores import Chroma
import math

#pipe = pipeline("summarization", model="facebook/bart-large-cnn")
#pipe = pipeline("question-answering", model="google-bert/bert-large-cased-whole-word-masking-finetuned-squad")

kw = pipeline("summarization", model="transformer3/H2-keywordextractor", device_map="cuda", max_length=50)

def calc_real_score(score, length):
    return score/(math.log(length,1000))

def generateCtx(item,db:Chroma) -> str :
    query_search = kw(item)[0]['summary_text']
    print(query_search)
    ctx_for_1 = db.similarity_search_with_relevance_scores(query_search,k=100)
    ctx_for_1.sort(key=lambda x: calc_real_score(x[1],len(x[0].metadata["text"])),reverse=True)
    threshold = 0.2
    docs = [it[0].metadata["text"] for it in ctx_for_1 if calc_real_score(it[1],len(it[0].metadata["text"]))][:5]
    print("------CTX-----")
    print("\n--------------\n".join(docs))
    print(len(docs))
    return docs
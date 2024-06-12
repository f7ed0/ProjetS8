from transformers import pipeline
from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores import Chroma
import torch

#pipe = pipeline("summarization", model="facebook/bart-large-cnn")
#pipe = pipeline("question-answering", model="google-bert/bert-large-cased-whole-word-masking-finetuned-squad")

#kw = pipeline("summarization", model="transformer3/H2-keywordextractor", device_map="cuda", max_length=50)
kw = pipeline("text2text-generation", model="ilsilfverskiold/tech-keywords-extractor", torch_dtype=torch.bfloat16, device_map="cuda",max_new_tokens=100)

def generateCtx(item,cdb:Chroma) -> list[str] :
    if len(item) < 10:
        return []
    query_search = kw(item)[0]['generated_text']
    thresholds = [0.4,0.3]
    print(query_search.lower())
    docs = []
    for i,db in enumerate(cdb) :
        ctx_for_1 = db.similarity_search_with_relevance_scores(query_search,k=6)
        ctx_for_1.sort(key=lambda x: x[1],reverse=True)
        print([it[1] for it in ctx_for_1])
        pre = [it[0].metadata["text"] for it in ctx_for_1 if it[1] > thresholds[i]]
        docs += pre[:max(min(len(pre),6-len(docs)),0)]
        if len(docs) >= 5 :
            break
    #print("------CTX-----")
    #print("\n--------------\n".join(docs))
    #print(len(docs))
    return docs
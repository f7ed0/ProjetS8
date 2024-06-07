import time
from transformers import pipeline
from langchain_community.vectorstores import Chroma

#pipe = pipeline("summarization", model="facebook/bart-large-cnn")

#pipe = pipeline("summarization", model="transformer3/H2-keywordextractor")

def generateCtx(item,db:Chroma) -> str :
    #kw = pipe(item)[0]['summary_text']
    #print(kw)
    ctx_for_1 = db.similarity_search_with_relevance_scores(item,k=10,)
    ret = [it[0].page_content for it in ctx_for_1 if it[1] > 0.3]
    print("------CTX-----")
    for i,item in enumerate(ret) :
        print("score :",ctx_for_1[i][1])
        print(item)
    print("--------------")
    return "\n".join(ret)
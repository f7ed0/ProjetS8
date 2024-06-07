import time
from transformers import pipeline
from langchain_community.vectorstores import Chroma
import dbgenerator

#pipe = pipeline("summarization", model="facebook/bart-large-cnn")
#pipe = pipeline("summarization", model="transformer3/H2-keywordextractor")

pipe = pipeline("question-answering", model="google-bert/bert-large-cased-whole-word-masking-finetuned-squad")

def generateCtx(item,db:Chroma) -> str :
    #kw = pipe(item)[0]['summary_text']
    #print(kw)
    ctx_for_1 = db.similarity_search_with_relevance_scores(item,k=5)
    ret = []
    threshold = 0.40
    while len(ret) == 0 and threshold > 0.2:
        ret = [it[0].page_content for it in ctx_for_1 if it[1] > threshold]
        threshold -= 0.05
    #ret = [it if len(it) < 750 else "\n".join([this['summary_text'] for this in dbgenerator.sumarry_pipeline([ca.page_content for ca in dbgenerator.txt_splitter.create_documents([it])])]) for it in ret]
    print("------CTX-----")
    for i,item in enumerate(ret) :
        print("score :",ctx_for_1[i][1])
        print(item)
    print("--------------")
    print(pipe({'question' : item, 'context' : "\n".join(ret)}))
    return "\n".join(ret)
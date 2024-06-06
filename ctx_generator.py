import time
from transformers import pipeline
from langchain_community.vectorstores import Chroma

#pipe = pipeline("summarization", model="facebook/bart-large-cnn")

pipe = pipeline("summarization", model="Falconsai/text_summarization")

def generateCtx(item,db:Chroma) -> str :
    ctx_for_1 = db.similarity_search_with_relevance_scores(item,k=4,)
    summary = pipe([it[0].page_content for it in ctx_for_1])
    ret =  '\n'.join([it['summary_text'] for it in summary])
    print("CONTEXT-----\n"+ret+"\n------------")
    with open("log/ctx_"+str(int(time.time()))+".txt","w") as f :
        f.write('\n------'.join(["relscore : "+str(it[1])+"\n"+it[0].page_content for it in ctx_for_1]))
        f.write("\n=============\n")
        f.write(ret)
    return ret
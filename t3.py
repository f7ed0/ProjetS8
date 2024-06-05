import torch
from transformers import AutoTokenizer,AutoModelForCausalLM
import dbgenerator
import ctx_generator

model_id = "google/gemma-1.1-2b-it"
#model_id = "microsoft/Phi-3-mini-128k-instruct"

tokenizer = AutoTokenizer.from_pretrained(model_id)
print(tokenizer.chat_template)
model = AutoModelForCausalLM.from_pretrained(model_id)

base = lambda x : {"role": "user","content":x+"\nTu est le chatbot de l'Universitée des Hauts-de-France, tu est là pour répondre a toute les question sur cet universitée et assister les personnes à mieux la connaître."}

messages = [
    base(""),
    {"role": "assistant", "content": "Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?"},
]

print("Assistant> Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?")

cdb = dbgenerator.loadEmbededDB()

while True :
    q = input("User> ")
    if q == "exit":
        break
    #print("NEW CONTEXT :",[item.page_content for item in cdb.similarity_search(q)])
    messages.append({"role" : "user", "content" : f'{q}'})
    messages[0] = base(ctx_generator.generateCtx(messages,cdb))



    inputs = tokenizer.apply_chat_template(messages,tokenize=True,add_generation_prompt=True,return_tensors="pt")

    gen_tokens = model.generate(
        inputs,
        max_new_tokens=500,
        temperature=1,
        do_sample=True,
    )

    resp = tokenizer.decode(gen_tokens[0]).split("<start_of_turn>model")

    rsp = resp[len(resp)-1][1:].replace("<eos>","")

    print("Assistant>",rsp)
    messages.append({"role" : "Assistant", "content" : rsp})

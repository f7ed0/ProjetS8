import torch
from transformers import AutoTokenizer,AutoModelForCausalLM
import dbgenerator
import ctx_generator
from huggingface_hub import *
import sys
import custom_template
import dbgenerator

pin_memory = True

model_id = "google/gemma-1.1-2b-it"
#model_id = "microsoft/Phi-3-mini-128k-instruct"
#model_id = "mistralai/Mistral-7B-Instruct-v0.3"

device = "cuda" if torch.cuda.is_available() else "cpu"



tokenizer = AutoTokenizer.from_pretrained(model_id)
if model_id == "google/gemma-1.1-2b-it":
    tokenizer.chat_template = custom_template.custom_template_gemma1_1
elif model_id == "microsoft/Phi-3-mini-128k-instruct":
    tokenizer.chat_template = custom_template.custom_template_phi3
elif model_id == "mistralai/Mistral-7B-Instruct-v0.3" :
    tokenizer.chat_template = custom_template.custom_template_mistral
model = AutoModelForCausalLM.from_pretrained(model_id,device_map="auto",torch_dtype=torch.float16)
print(model.config)
base = lambda x : {"role": "system","content": "Contexte supplémentaire : "+x+"\n"}

messages = [
    {"role" : "system","content" : "Tu est une IA d'Assistance conversationelle de l'Universitée des Hauts-de-France, tu as une discussion avec un (futur) membre de l'UPHF. Le système te fournira des informations fiables que tu peux utiliser pour répondre aux questions de user"},
    {"role": "assistant", "content": "Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?"},
]

print("Assistant> Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?")

cdb = dbgenerator.loadEmbededDB()

def extract_context(q):
    inputs = tokenizer.apply_chat_template(messages[2:]+[{"role" : "system" , "content" : f"Reformule cette question en prenant en compte du contexte : \"{q}\""}],
        tokenize=True,add_generation_prompt=True,return_tensors="pt"
    ).to(device)
    gen_tokens = model.generate(
        inputs,
        max_new_tokens=600,
        temperature=0.1,
        do_sample=True,
    )

    resp = tokenizer.decode(gen_tokens[0]).split("<start_of_turn>model")

    rsp = resp[len(resp)-1][1:].replace("<eos>","")

    return rsp

while True :
    q = input("User> ")
    if q == "exit":
        break
    #print("NEW CONTEXT :",[item.page_content for item in cdb.similarity_search(q)])
    #print("-------------\n",extract_context(q),"\n--------------------")
    ctx = ctx_generator.generateCtx(q,cdb)
    print(len(ctx),end="\t")
    ctx = [it for it in ctx if it not in "\n".join([jt['content'] for jt in messages if jt['role'] == 'system'])]
    print(len(ctx))
    if(len(ctx) != 0):
        messages.append(base("\n".join(ctx)))
    messages.append({"role" : "user", "content" : q})

    inputs = tokenizer.apply_chat_template(messages,tokenize=True,add_generation_prompt=True,return_tensors="pt").to(device)

    gen_tokens = model.generate(
        inputs,
        max_new_tokens=600,
        temperature=0.1,
        do_sample=True,
    )

    resp = tokenizer.decode(gen_tokens[0]).split("<start_of_turn>model")

    rsp = resp[len(resp)-1][1:].replace("<eos>","")

    print("Assistant>",rsp)
    messages.append({"role" : "Assistant", "content" : rsp})

    torch.cuda.empty_cache()
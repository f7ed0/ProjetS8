import torch
from transformers import AutoTokenizer,AutoModelForCausalLM
import dbgenerator
import ctx_generator
from huggingface_hub import *
import sys
import custom_template

pin_memory = True

model_id = "google/gemma-1.1-2b-it"
#model_id = "microsoft/Phi-3-mini-128k-instruct"

device = "cuda" if torch.cuda.is_available() else "cpu"


tokenizer = AutoTokenizer.from_pretrained(model_id)
tokenizer.chat_template = custom_template.custom_template_gemma1_1
#print(tokenizer.chat_template)
model = AutoModelForCausalLM.from_pretrained(model_id).to(device)

base = lambda x : {"role": "system","content": "Contexte supplémentaire : "+x+"\n"}

messages = [
    {"role" : "system","content" : "Tu est une IA d'Assistance conversationelle de l'Universitée des Hauts-de-France, tu est là pour répondre aux questions sur cet universitée et échanger avec eux pour les aider a la connaitre à mieux la connaître."},
    {"role": "assistant", "content": "Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?"},
]

print("Assistant> Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?")

cdb = dbgenerator.loadEmbededDB()

while True :
    q = input("User> ")
    if q == "exit":
        break
    #print("NEW CONTEXT :",[item.page_content for item in cdb.similarity_search(q)])
    messages.append(base(ctx_generator.generateCtx(q,cdb)))
    messages.append({"role" : "user", "content" : f'{q}'})


    inputs = tokenizer.apply_chat_template(messages,tokenize=True,add_generation_prompt=True,return_tensors="pt").to(device)

    gen_tokens = model.generate(
        inputs,
        max_new_tokens=500,
        temperature=1,
        do_sample=True,
    )

    match model_id:
        case "google/gemma-1.1-2b-it":
            resp = tokenizer.decode(gen_tokens[0]).split("<start_of_turn>model")

            rsp = resp[len(resp)-1][1:].replace("<eos>","")

            print("Assistant>",rsp)
            messages.append({"role" : "Assistant", "content" : rsp})
        case "microsoft/Phi-3-mini-128k-instruct":
            resp = tokenizer.decode(gen_tokens[0]).split("<|assistant|>")

            rsp = resp[len(resp)-1].replace("<|end|>","")

            print("Assistant>",rsp)
            messages.append({"role" : "Assistant", "content" : rsp})
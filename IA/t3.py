import torch
from transformers import AutoTokenizer,AutoModelForCausalLM
import dbgenerator
import ctx_generator
from huggingface_hub import *
import custom_template
import dbgenerator
import gc

pin_memory = True

model_id = "google/gemma-1.1-2b-it"

device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = AutoTokenizer.from_pretrained(model_id)
tokenizer.chat_template = custom_template.custom_template_gemma1_1
model = AutoModelForCausalLM.from_pretrained(model_id,device_map="auto", torch_dtype=torch.bfloat16,use_safetensors=True)
print(model.config)
base = lambda x : {"role": "system","content": "Contexte supplémentaire : "+x+"\n"}

messages = [
    {"role" : "system","content" : "Tu est une IA d'Assistance conversationelle de l'Universitée des Hauts-de-France. Tu as une discussion avec un (futur) membre de l'UPHF. Fais des réponses rédigées et précise. Le système te fournira des informations fiables que tu peux utiliser pour répondre aux questions de user. N'utilise que les informations dont tu est sûr."},
    {"role": "assistant", "content": "Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?"},
]

print("Assistant> Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?")

cdb = dbgenerator.loadEmbededDB()

def flush():
  gc.collect()
  torch.cuda.empty_cache()
  torch.cuda.reset_peak_memory_stats()

while True :
    q = input("User> ")
    if q == "exit":
        break

    ctx = ctx_generator.generateCtx(q,cdb)

    if(len(ctx) != 0):
        messages = messages[:1] + [it for it in messages[1:] if it['role'] != 'system']
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
    flush()
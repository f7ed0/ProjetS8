import torch
from transformers import AutoTokenizer,AutoModelForCausalLM
import IA.dbgenerator
import IA.ctx_generator
from huggingface_hub import *
import IA.custom_template
import gc

model_id = "google/gemma-1.1-2b-it"

device = "cuda" if torch.cuda.is_available() else "cpu"

base = lambda x : {"role": "system","content": "Contexte supplémentaire : "+x+"\n"}

userPrompt = lambda message : {"role": "user","content": message}

messages = [
    {"role" : "system","content" : "Tu est une IA d'Assistance conversationelle de l'Universitée des Hauts-de-France. Tu as une discussion avec un (futur) membre de l'UPHF. Fais des réponses rédigées et précise. Le système te fournira des informations fiables que tu peux utiliser pour répondre aux questions de user. N'utilise que les informations dont tu est sûr."},
    {"role": "assistant", "content": "Bonjour ! Je suis l'assistant UPHF. comment puis-je vous aider ?"},
]

def flush():
  gc.collect()
  torch.cuda.empty_cache()
  torch.cuda.reset_peak_memory_stats()

"""
Initialize the AI
"""
def init():
    global cdb,model,tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    tokenizer.chat_template = IA.custom_template.custom_template_gemma1_1
    model = AutoModelForCausalLM.from_pretrained(model_id,device_map="auto", torch_dtype=torch.bfloat16,use_safetensors=True)
    cdb = IA.dbgenerator.loadEmbededDB()

"""
@param history : tout les anciens messages de la conversation (sans le prompt utilisateur.)
@param user_prompt : prompt actuel de l'utilisateur
"""
def GenerateNewResponse(history:list[dict[str]], user_prompt:str) -> str:
    print(user_prompt)
    ctx = IA.ctx_generator.generateCtx(user_prompt,cdb)
    msg = messages + history
    if(len(ctx) > 0):
        msg.append(base("\n".join(ctx)))
    msg.append(userPrompt(user_prompt))
    
    inputs = tokenizer.apply_chat_template(msg,tokenize=True,add_generation_prompt=True,return_tensors="pt").to(device)

    gen_tokens = model.generate(
        inputs,
        max_new_tokens=600,
        temperature=0.1,
        do_sample=True,
    )

    resp = tokenizer.decode(gen_tokens[0]).split("<start_of_turn>model")
    rsp = resp[len(resp)-1][1:].replace("<eos>","")

    flush()

    return rsp
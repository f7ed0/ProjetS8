import torch
from transformers import AutoTokenizer,AutoModelForCausalLM
from pypdf import PdfReader
import os

tokenizer = AutoTokenizer.from_pretrained("google/gemma-1.1-2b-it")
print(tokenizer.chat_template)
model = AutoModelForCausalLM.from_pretrained("google/gemma-1.1-2b-it")

reader = PdfReader('docs/eb4ca340-c217-4bbd-939b-92307eb908b6.pdf')

print(len(reader.pages)) 

ctx = ""
for page in reader.pages :
    ctx += page.extract_text()+"\n"

messages = [
    {"role": "user","content":ctx+"\nTu est le chatbot de l'Universitée des Hauts-de-France, tu est là pour répondre a toute les question des personnes sur cet universitée."},
    {"role": "assistant", "content": "Bonjour ! Je suis l'assistant UPHF comment puis-je vous aider ?"},
]

while True :
    q = input("User> ")
    messages.append({"role" : "user", "content" : q})

    inputs = tokenizer.apply_chat_template(messages,tokenize=True,add_generation_prompt=True,return_tensors="pt")

    gen_tokens = model.generate(
        inputs,
        max_new_tokens=180,
        temperature=1,
        do_sample=True,
    )


    print(tokenizer.decode(gen_tokens[0]))
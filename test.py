from pypdf import PdfReader
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

reader = PdfReader('docs/eb4ca340-c217-4bbd-939b-92307eb908b6.pdf')

print(len(reader.pages)) 

ctx = ""
for page in reader.pages :
    ctx += page.extract_text()+"\n"



messages = [
    {"role": "user", "content": "Tu est le chat bot de l'Universitée des Hauts-de-France, tu est là pour répondre a toute les question des personnes sur cet universitée."},
    {"role": "user", "content": "voici du contenu sur lesquels te baser :\n"+ctx},
    {"role": "user", "content": "bonjour, qu'est-ce que l'UPHF ?"},
]

tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-128k-instruct",
    device_map="auto",
    torch_dtype="auto",
    trust_remote_code=True,
)

model = AutoModelForCausalLM.from_pretrained("microsoft/Phi-3-mini-128k-instruct", trust_remote_code=True)

input_ids = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt")

gen_tokens = model.generate(
    input_ids,
    max_new_tokens=100,
    temperature=0.1,
    do_sample=True,
)

gen_text = tokenizer.decode(gen_tokens[0])
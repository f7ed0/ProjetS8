from pypdf import PdfReader

reader = PdfReader('docs/eb4ca340-c217-4bbd-939b-92307eb908b6.pdf')

print(len(reader.pages)) 

ctx = ""
for page in reader.pages :
    ctx += page.extract_text()+"\n"

from transformers import AutoTokenizer, AutoModelForCausalLM,pipeline

tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-128k-instruct", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("microsoft/Phi-3-mini-128k-instruct", trust_remote_code=True)

messages = [
    {"role": "user", "content":ctx},
    {"role": "user", "content": "Tu est le chat bot de l'Universitée des Hauts-de-France, tu est là pour répondre a toute les question des personnes sur cet universitée."},
    {"role": "user", "content": "bonjour, qu'est-ce que l'UPHF ?"},
]


pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
)

generation_args = {
    "max_new_tokens": 500,
    "return_full_text": False,
    "temperature": 0.0,
    "do_sample": False,
}

output = pipe(messages, **generation_args)
print(output[0]['generated_text'])
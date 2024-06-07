from transformers import pipeline

pipe = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.3")

print(pipe.tokenizer.chat_template)
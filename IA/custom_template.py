custom_template_gemma1_1 =  """{{ bos_token }}{% for message in messages %}{% if (message['role'] == 'assistant') %}{% set role = 'model' %}{% else %}{% set role = message['role'] %}{% endif %}{{ '<start_of_turn>' + role + '
' + message['content'] | trim + '<end_of_turn>
' }}{% endfor %}{% if add_generation_prompt %}{{'<start_of_turn>model
'}}{% endif %}"""

custom_template_phi3 = """{{ bos_token }}{% for message in messages %}{% if (message['role'] == 'user') %}{{'<|user|>' + '
' + message['content'] + '<|end|>' + '
'}}{% elif (message['role'] == 'assistant') %}{{'<|assistant|>' + '
'+ message['content'] + '<|end|>' + '
'}}{% elif (message['role'] == 'system') %}{{'<|system|>' + '
'+message['content'] + '<|end|>' + '
'}}{% endif %}{% endfor %}"""

custom_template_mistral = """  {%- for message in messages %}
      {%- if message['role'] == 'system' -%}
          {{- message['content'] -}}
      {%- else -%}
          {%- if message['role'] == 'user' -%}
              {{-' [INST] ' + message['content'].rstrip() + ' [/INST] '-}}
          {%- else -%}
              {{-'' + message['content'] + '</s>' -}}
          {%- endif -%}
      {%- endif -%}
  {%- endfor -%}
  {%- if add_generation_prompt -%}
      {{-''-}}
  {%- endif -%}"""
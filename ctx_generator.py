def generateCtx(discussion:list[dict[str]],db) -> str :
    user_prompts = [it for it in discussion]
    nb_prompt = len(user_prompts)
    #print(user_prompts[2:][::-1])
    ret = ""
    for i,item in enumerate(user_prompts[2:][::-1]):
        ctx_for_1 = db.similarity_search(item["content"])
        percentage = (nb_prompt-i / nb_prompt)
        if len(ctx_for_1) > 0:
            ret += '\n'.join([it.page_content for it in ctx_for_1[:int((len(ctx_for_1)-1)*percentage)]])
    #print(ret)
    return ret
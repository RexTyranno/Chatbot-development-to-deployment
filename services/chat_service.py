from openai import OpenAI
import os

api_key= os.getenv('API_KEY')
client= OpenAI(api_key=api_key)

def ask_openai(question,chat_history=[]):
    try:
        chat_history=[{"role":"system","content":"Talk Like you are a cat"}]
        chat_history.append({"role":"user","content":question})
        
        response=client.chat.completions.create(
            model="chatgpt-4o-latest",
            messages=chat_history,
            temperature=0.7
        )
        
        assistant_response= response.choices[0].message.content 
        chat_history.append({"role":"assistant","content":assistant_response})
        
        return assistant_response
    except Exception as e:
        return f"An error has occured: {e}"
from flask import Blueprint, request, jsonify
from services.chat_service import ask_openai

chat_bp = Blueprint('chat', __name__, url_prefix='/chat')

@chat_bp.route('', methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        question = data.get("question","").strip()
        chat_history= data.get("history",[])
        
        if not question:
            return jsonify({"error": "Question cannot be empty"}), 400
        
        reply= ask_openai(question, chat_history)
        
        if reply.startswith("An error occurred") or reply.startswith("An error has occurred"):
            return jsonify({"error": reply}), 500
        
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error":f"An unexpected error has occurred: {str(e)}"}), 500
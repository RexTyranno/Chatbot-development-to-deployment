from flask import Flask, render_template
from routes.chat_routes import chat_bp
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.register_blueprint(chat_bp)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
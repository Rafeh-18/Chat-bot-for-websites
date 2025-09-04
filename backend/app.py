from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)

# Initialize client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your_api_key_here"))

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful website assistant."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )

        bot_reply = response.choices[0].message.content.strip()
        return jsonify({"reply": bot_reply})

    except Exception as e:
        return jsonify({"reply": f" Error: {str(e)}"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)

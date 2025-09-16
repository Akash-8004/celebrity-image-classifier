from flask import Flask, request, jsonify
import util
from flask_cors import CORS
import os



app = Flask(__name__)
CORS(app)

@app.route('/classify_image', methods=['GET', 'POST'])
def classify_image():
    image_data = request.form['image_data']

    response = jsonify(util.classify_image(image_data))

    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    port = int(os.environ.get("PORT", 5000))  # Use Render's PORT, fallback 5000 for local dev
    app.run(host="0.0.0.0", port=port)
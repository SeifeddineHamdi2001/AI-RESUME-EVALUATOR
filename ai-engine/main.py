from flask import Flask, request, jsonify
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json['text']
    doc = nlp(data)
    return jsonify({"tokens": [token.text for token in doc]})

if __name__ == '__main__':
    app.run(port=8000)

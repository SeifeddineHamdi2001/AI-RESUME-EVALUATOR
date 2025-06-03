from flask import Flask, request, jsonify
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

# ai-engine/main.py
@app.post('/evaluate')
def evaluate_resume():
    resume_text = extract_text(request.files['resume'])
    score = analyze_resume(resume_text)  # Your evaluate.py logic
    suggestions = generate_suggestions(resume_text)
    return jsonify({ 'score': score, 'suggestions': suggestions })

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json['text']
    doc = nlp(data)
    return jsonify({"tokens": [token.text for token in doc]})

if __name__ == '__main__':
    app.run(port=8000)

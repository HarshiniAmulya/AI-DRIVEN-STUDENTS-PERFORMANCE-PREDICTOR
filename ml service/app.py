from flask import Flask, request, jsonify
import joblib
import numpy as np
from transformers import pipeline

app = Flask(__name__)
model = joblib.load("model.pkl")

summarizer = pipeline("summarization")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    
    features = np.array([[
        data['attendance'],
        data['internal_marks'],
        data['assignment_score'],
        data['previous_gpa']
    ]])
    
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]
    
    risk = "High Risk" if probability < 0.5 else "Low Risk"
    
    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability),
        "risk_level": risk
    })

@app.route("/summarize", methods=["POST"])
def summarize():
    text = request.json['text']
    summary = summarizer(text, max_length=150, min_length=50)
    return jsonify({"summary": summary[0]['summary_text']})

if __name__ == "__main__":
    app.run(port=6000)
from flask import Flask, request, jsonify
import joblib
import numpy as np
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

app = Flask(__name__)

model = joblib.load("model.pkl")
summarizer = pipeline("summarization")
chatbot = pipeline("text-generation", model="microsoft/DialoGPT-medium")

# -------------------- Prediction --------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array([[ 
        data['attendance'],
        data['internal_marks'],
        data['assignment_score'],
        data['previous_gpa']
    ]])
    
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]
    
    risk = "High Risk" if probability < 0.5 else "Low Risk"
    
    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability),
        "risk_level": risk
    })

# -------------------- Notes Summarization --------------------
@app.route("/summarize", methods=["POST"])
def summarize():
    text = request.json['text']
    summary = summarizer(text, max_length=150, min_length=50)
    return jsonify({"summary": summary[0]['summary_text']})

# -------------------- AI Chatbot --------------------
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json["message"]
    response = chatbot(user_input, max_length=100)
    return jsonify({"reply": response[0]['generated_text']})

# -------------------- VTU Question Analyzer --------------------
@app.route("/analyze-vtu", methods=["POST"])
def analyze_vtu():
    questions = request.json["questions"]
    
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(questions)
    
    feature_array = vectorizer.get_feature_names_out()
    tfidf_sorting = np.argsort(X.toarray()).flatten()[::-1]
    
    top_topics = feature_array[tfidf_sorting][:10]
    
    return jsonify({"important_topics": list(top_topics)})

if __name__ == "__main__":
    app.run(port=6000)

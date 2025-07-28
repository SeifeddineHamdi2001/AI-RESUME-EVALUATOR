# 🧠 AI Resume Evaluator

An AI-powered web platform where **candidates can evaluate resumes** using LLM feedback before applying, and **recruiters** can post jobs, view resumes, and make decisions with **AI-generated insights**.

> Built with `meta/llama-4-maverick-17b-128e-instruct` via **NVIDIA Inference API (NIM)**.

[![License](https://img.shields.io/github/license/SeifeddineHamdi2001/AI-RESUME-EVALUATOR)](LICENSE)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![Model](https://img.shields.io/badge/Model-LLaMA--4--Maverick--17B-green)
![Powered By](https://img.shields.io/badge/LLM-NVIDIA%20API%20(NIM)-orange)

---

## 🚀 Features

### 🎓 For Candidates
- Upload resume (PDF)
- Get:
  - AI-generated score (0–100)
  - Feedback per section: **Summary, Skills, Experience**
  - Actionable improvements (keywords, phrasing, structure)

### 🧑‍💼 For Recruiters
- Post job offers with skills & requirements
- Review AI feedback on each resume
- Accept/reject with structured scoring

---

## 🧠 AI Model

- **Model**: `meta/llama-4-maverick-17b-128e-instruct`
- **Provider**: NVIDIA Inference Microservice (NIM)
- **Inference**: HTTPS REST API with token-based auth
- **Prompt Design**: Role-instructional prompts for recruiter-style evaluation and skill gap analysis

---

## 🛠️ Tech Stack

| Layer         | Tech                                |
|---------------|--------------------------------------|
| Frontend      | React, TailwindCSS                   |
| Backend       | Python + FastAPI                     |
| AI Layer      | NVIDIA API (NIM) + LLaMA-4 Maverick  |
| Parsing       | PyMuPDF, LangChain, spaCy            |
| Database      | MongoDB                              |
| Deployment    | Docker, Render/Railway               |

---

## 📦 Setup

```bash
git clone https://github.com/SeifeddineHamdi2001/AI-RESUME-EVALUATOR
cd AI-RESUME-EVALUATOR/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

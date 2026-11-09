# SkillApply — Smart Job Application Form

> **Flutter Web · Material Design 3 · UN SDG 8: Decent Work & Economic Growth**

A modern, responsive job application form built entirely with Flutter and Dart. Applicants can enter personal details, select technical skills, set years of experience using an interactive slider, provide a resume filename, and submit their application — all in the browser.

---

## 📋 Features

| Feature | Detail |
|---------|--------|
| **Personal Information** | Full name, email (validated), phone (validated), job role dropdown |
| **Skills Selection** | 10 animated selectable chips (Java, Python, Dart, Flutter, HTML/CSS, JavaScript, SQL, Git/GitHub, Communication, Problem Solving) |
| **Experience Slider** | 0–20 years, integer steps, live label + level badges (Fresher → Expert) |
| **Resume Filename** | Text entry with `.pdf`/`.docx` validation; no actual file upload |
| **Cover Letter** | Optional multiline text field (up to 600 characters) |
| **Confirmation** | Required checkbox: "I confirm the information is accurate" |
| **Submit & Reset** | Full form validation on submit; one-click reset |
| **Success Summary** | Application summary card shown after successful submission |
| **Responsive Design** | Adapts from 320 px mobile to 1440 px+ desktop |

---

## 🚀 Setup & Run Locally

```bash
cd job_application_flutter
flutter pub get
flutter run -d chrome
```

---

## 🌐 Netlify Deployment

This repository is pre-configured with `netlify.toml` and GitHub Actions for continuous deployment to Netlify.

1. Connect this GitHub repository on **[app.netlify.com](https://app.netlify.com)**.
2. Netlify will automatically detect `netlify.toml`, build the Flutter web application, and deploy it.

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

## 🎨 Design

- **Background**: Light grey `#F5F7FA`
- **Primary**: Navy Blue `#1565C0`
- **Accent**: Purple `#7B1FA2`
- **Cards**: White with rounded corners and subtle shadow
- **Typography**: Roboto (Material default)

---

## 🗂️ Project Structure

```
job_application_flutter/
├── android/                  Flutter Android platform
├── ios/                      Flutter iOS platform
├── lib/
│   └── main.dart             Complete app — all screens & widgets
├── linux/                    Flutter Linux platform
├── macos/                    Flutter macOS platform
├── test/
│   └── widget_test.dart      Basic Flutter widget tests
├── web/
│   ├── index.html            Flutter Web entry point
│   ├── manifest.json         PWA manifest (theme: #1565C0)
│   └── icons/                App icons
├── windows/                  Flutter Windows platform
├── .gitignore
├── analysis_options.yaml
├── pubspec.yaml
├── README.md
├── ACCURACY_ENHANCEMENT_SUMMARY.md
├── CLEANUP_SUMMARY.md
├── ENHANCED_ACCURACY_GUIDE.md
├── ENHANCED_DOCUMENT_HANDLING.md
└── LICENSE
```

---

## ⚙️ Requirements

| Tool | Minimum Version |
|------|----------------|
| Flutter SDK | 3.10.0 |
| Dart SDK | 3.0.0 |
| Chrome / Edge | Any modern browser |

No third-party packages are required. The app uses the Flutter SDK only.

---

## 🚀 Setup & Run

### 1. Clone / download

```bash
git clone https://github.com/YOUR_USERNAME/job_application_flutter.git
cd job_application_flutter
```

### 2. Get dependencies

```bash
flutter pub get
```

### 3. Run in the browser

```bash
flutter run -d chrome
```

### 4. Build for production

```bash
flutter build web
```

The compiled output will be in `build/web/`. Deploy the contents of that folder to any static hosting service (GitHub Pages, Netlify, Vercel, Firebase Hosting, etc.).

---

## 🌐 Run on FlutLab.io (no local install needed)

1. Go to [https://flutlab.io](https://flutlab.io) and sign in.
2. Create a **New Project → Import ZIP**.
3. Zip the `job_application_flutter/` folder and upload it.
4. Click **Run** ▶ — the app opens in the browser preview.

---

## 🧪 Tests

```bash
flutter test
```

The test suite in `test/widget_test.dart` checks:
- App renders without errors
- Form heading and tagline are visible
- Submit and Reset buttons are present
- Required-field validation fires on empty submission

---

## 📤 GitHub Publishing

```bash
# Inside the project folder
git init
git add .
git commit -m "feat: initial SkillApply job application form"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job_application_flutter.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 📸 Screenshots

| Mobile View | Desktop View |
|:-----------:|:------------:|
| _Run the app and take a screenshot_ | _Run the app at full-width and take a screenshot_ |

---

## ⚠️ Limitations

- Form data is stored in Flutter widget state only — it is **not persisted** after a page refresh or browser close.
- Resume filename is recorded as text only. **No file is uploaded** to any server.
- No backend, database, or authentication is implemented.
- Email and phone validations use client-side regex patterns only.

---

## 🌍 SDG Connection

This project contributes to **UN Sustainable Development Goal 8 — Decent Work and Economic Growth** by providing an accessible, structured job application experience that helps applicants present their skills and qualifications clearly to potential employers.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

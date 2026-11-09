# Enhanced Document Handling

**Project:** SkillApply — Smart Job Application Form  
**Document Purpose:** Guide to how the application handles all user-submitted document data  
**Version:** 1.0.0  

---

## Introduction

"Document handling" in the SkillApply context refers to how the application receives, validates, stores, and presents every piece of structured data that the applicant enters — from text fields to chip selections. Because this is a client-only Flutter Web application with no backend, all data handling occurs in device memory during the session.

This document explains what data is collected, how it flows through the application, what transformations are applied, and what the current limitations are.

---

## 1. Data Model

The application collects the following fields per submission:

| Field | Dart Type | Source Widget | Required |
|-------|-----------|---------------|----------|
| Full Name | `String` | `TextFormField` | ✅ Yes |
| Email Address | `String` | `TextFormField` | ✅ Yes |
| Phone Number | `String` | `TextFormField` | ✅ Yes |
| Job Role | `String?` | `DropdownButtonFormField` | ✅ Yes |
| Selected Skills | `Set<String>` | Custom `_SkillChip` widgets | ✅ Min 1 |
| Experience Years | `double` | `Slider` | ✅ (default 0) |
| Resume Filename | `String` | `TextFormField` | ✅ Yes |
| Cover Letter | `String` | `TextField` | ❌ Optional |
| Confirmation | `bool` | Custom checkbox | ✅ Yes |

All fields are stored as instance variables in `_JobApplicationFormState`. No serialisation or persistent storage is used in this version.

---

## 2. Data Flow Diagram

```
User Input (widget interaction)
        │
        ▼
TextEditingController / setState()
        │
        ▼
_JobApplicationFormState (in-memory)
        │
        ├── On Submit → Validate → _buildSuccessCard()
        │                               │
        │                               └── Read state fields and display summary
        │
        └── On Reset  → Clear all controllers + setState() resets all fields
```

---

## 3. Resume Filename Handling

### Current Implementation

The Resume Filename field accepts a plain text string representing the name of a resume file. No file binary data, file stream, or file path is handled. The entry is stored as `_resumeCtrl.text` in memory.

```dart
TextFormField(
  controller: _resumeCtrl,
  decoration: const InputDecoration(
    labelText: 'Resume File Name *',
    hintText: 'e.g. Harshini_Resume.pdf',
    helperText: 'Enter the filename of your resume (.pdf or .docx).',
  ),
  validator: (v) {
    if (v == null || v.trim().isEmpty) return 'Resume filename is required.';
    final lower = v.trim().toLowerCase();
    if (!lower.endsWith('.pdf') && !lower.endsWith('.docx'))
      return 'Filename must end with .pdf or .docx';
    return null;
  },
),
```

### Accepted Filename Formats

| Filename | Accepted? | Reason |
|----------|-----------|--------|
| `Harshini_Resume.pdf` | ✅ Yes | Ends with `.pdf` |
| `cv_2024.docx` | ✅ Yes | Ends with `.docx` |
| `resume.PDF` | ✅ Yes | `.toLowerCase()` applied |
| `Resume.DOCX` | ✅ Yes | `.toLowerCase()` applied |
| `myresume` | ❌ No | No recognised extension |
| `resume.doc` | ❌ No | `.doc` not supported in this version |
| *(empty)* | ❌ No | Required field |

### Why No Real File Upload?

Flutter Web's file access APIs (`dart:html`, `file_picker` package) require:
- Additional package dependencies.
- Browser permission dialogs.
- Server-side endpoints to receive the binary data.

None of these are available in a static Flutter Web deployment without a backend. The filename-only approach:
- Works everywhere (FlutLab.io, GitHub Pages, Netlify).
- Requires zero configuration.
- Is transparent to the applicant (a helper text explains the limitation).

### Future Enhancement

To support real file uploads, add the `file_picker` package and a server endpoint:

```dart
import 'package:file_picker/file_picker.dart';

Future<void> _pickFile() async {
  final result = await FilePicker.platform.pickFiles(
    type: FileType.custom,
    allowedExtensions: ['pdf', 'docx'],
  );
  if (result != null) {
    setState(() => _resumeCtrl.text = result.files.single.name);
    // Upload result.files.single.bytes to your server here
  }
}
```

---

## 4. Skills Data Handling

Skills are stored in a `Set<String>` — a collection that automatically prevents duplicates.

```dart
final Set<String> _selectedSkills = {};

// Toggle on chip tap:
_selectedSkills.contains(name)
    ? _selectedSkills.remove(name)   // Deselect
    : _selectedSkills.add(name);     // Select
```

When the success summary is rendered, the set is iterated:

```dart
_selectedSkills.map((s) => SkillBadge(label: s)).toList()
```

The `Set` type provides O(1) lookup for `contains()`, making skill toggle operations instant regardless of set size.

---

## 5. Text Field Data Sanitisation

Before any value from a `TextEditingController` is used in the success summary, it is trimmed:

```dart
_nameCtrl.text.trim()
_emailCtrl.text.trim()
_phoneCtrl.text.trim()
_resumeCtrl.text.trim()
```

This removes accidental leading or trailing whitespace that a user may have typed without noticing. Without this step, `" Harshini "` would display and be stored differently from `"Harshini"`.

---

## 6. Form Reset — Complete Data Clearing

The Reset Form button clears all data completely:

```dart
void _reset() {
  _formKey.currentState?.reset();   // Clears TextFormField error state
  _nameCtrl.clear();
  _emailCtrl.clear();
  _phoneCtrl.clear();
  _resumeCtrl.clear();
  _coverLetterCtrl.clear();
  setState(() {
    _selectedRole    = null;
    _selectedSkills.clear();
    _experienceYears = 0;
    _confirmed       = false;
    _skillsError     = false;
    _confirmedError  = false;
    _isSubmitting    = false;
    _submitted       = false;
  });
}
```

Calling `_formKey.currentState?.reset()` is important — it clears the internal `TextFormField` state (including previously shown error messages) in addition to the controller text.

---

## 7. Controller Lifecycle Management

All `TextEditingController` instances are created once (at field declaration) and disposed when the widget is removed from the tree:

```dart
@override
void dispose() {
  _nameCtrl.dispose();
  _emailCtrl.dispose();
  _phoneCtrl.dispose();
  _resumeCtrl.dispose();
  _coverLetterCtrl.dispose();
  super.dispose();
}
```

Failing to dispose controllers causes memory leaks. The `dispose()` override is therefore mandatory and must be updated whenever a new controller is added.

---

## 8. Data Display in the Success Summary

After successful submission, all collected data is read from the in-memory state and displayed in `_buildSummaryCard()`. No transformation occurs at this point beyond `trim()`. The `_expLabel` getter converts the raw `double` slider value to a human-readable string:

```dart
String get _expLabel {
  final y = _experienceYears.toInt();
  if (y == 0) return 'Fresher';
  return y == 1 ? '1 year' : '$y years';
}
```

---

## 9. Data Privacy Notice

The following statements are true for the current version of SkillApply:

- ✅ No data is sent to any server or third-party service.
- ✅ No data is written to local storage, cookies, or IndexedDB.
- ✅ All data is lost when the browser tab is closed or refreshed.
- ✅ No analytics, telemetry, or tracking scripts are included.
- ✅ No authentication or account creation is required.

---

## 10. Recommended Production Enhancements

| Enhancement | Library / Approach |
|-------------|-------------------|
| Persist form data across refreshes | `shared_preferences` package + JSON serialisation |
| Real file upload | `file_picker` + REST API endpoint |
| Server submission | HTTP POST with `dart:io` or `http` package |
| Data encryption at rest | AES encryption before writing to local storage |
| Form auto-save on field change | `TextEditingController.addListener()` + debounce |
| GDPR/privacy consent | Additional consent checkbox + privacy policy link |

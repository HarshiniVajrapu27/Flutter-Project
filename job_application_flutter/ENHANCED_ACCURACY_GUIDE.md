# Enhanced Accuracy Guide

**Project:** SkillApply — Smart Job Application Form  
**Document Purpose:** Developer guide for understanding, testing, and extending input accuracy  
**Version:** 1.0.0  

---

## Introduction

This guide explains *how* each form field in SkillApply validates user input, *why* each rule was chosen, and *how* to extend or customise the validation logic. It is intended for developers who wish to maintain, improve, or adapt this form for their own projects.

---

## 1. Validation Architecture

All validation in SkillApply follows this flow:

```
User taps "Submit Application"
          │
          ▼
  _formKey.currentState!.validate()
  ┌──────────────────────────────────┐
  │  Calls validator() on each       │
  │  TextFormField in the form tree. │
  │  Returns false if any fails.     │
  └──────────────────────────────────┘
          │
          ▼
  _selectedSkills.isNotEmpty  ──── false ──▶ Show skills error
          │ true
          ▼
  _confirmed == true  ──────────── false ──▶ Show confirmation error
          │ true
          ▼
  setState(_isSubmitting = true)
  await Future.delayed(2 seconds)   ← simulated processing
  setState(_submitted = true)
          │
          ▼
  _buildSuccessCard() is rendered
```

This ensures that **all** validation runs before any state change occurs.

---

## 2. Field-by-Field Validation Reference

### 2.1 Full Name

```dart
validator: (v) {
  if (v == null || v.trim().isEmpty) return 'Full name is required.';
  if (v.trim().length < 2)          return 'Name must be at least 2 characters.';
  return null;
},
```

**Why trim()?** Leading/trailing spaces are not meaningful in a name field. `trim()` prevents a user from entering a single space and passing the empty check.

**Extending:** To require only alphabetic characters:
```dart
if (!RegExp(r"^[a-zA-Z\s\-']+$").hasMatch(v.trim()))
  return 'Name may only contain letters, spaces, hyphens, or apostrophes.';
```

---

### 2.2 Email Address

```dart
final emailRegex = RegExp(
  r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$');
if (!emailRegex.hasMatch(v.trim())) return 'Enter a valid email.';
```

**Pattern breakdown:**

| Segment | Matches |
|---------|---------|
| `[a-zA-Z0-9._%+\-]+` | Local part (before `@`) |
| `@` | Required separator |
| `[a-zA-Z0-9.\-]+` | Domain name |
| `\.` | Dot before TLD |
| `[a-zA-Z]{2,}` | Top-level domain (at least 2 letters) |

**Whitespace prevention:**
```dart
inputFormatters: [FilteringTextInputFormatter.deny(RegExp(r'\s'))],
```
This runs on every keystroke — the user cannot type a space at all.

**Extending:** For stricter validation (e.g., only allow company emails):
```dart
if (!v.trim().endsWith('@yourcompany.com'))
  return 'Please use your company email address.';
```

---

### 2.3 Phone Number

```dart
final digits = v.replaceAll(RegExp(r'\D'), '');
if (digits.length < 7 || digits.length > 15)
  return 'Enter a valid phone (7–15 digits).';
```

**Why strip non-digits first?** Users commonly enter `+91 98765-43210` or `(020) 1234 5678`. Stripping all non-digit characters before counting means all common international formats pass correctly.

**Extending:** To enforce a specific country code:
```dart
if (!v.trim().startsWith('+91'))
  return 'Please enter an Indian phone number starting with +91.';
```

---

### 2.4 Job Role

```dart
validator: (v) => v == null ? 'Please select a job role.' : null,
```

The `DropdownButtonFormField` calls this validator automatically when the form is submitted. A null value means the user has not made a selection.

**Extending:** To add a dynamic role list loaded from state:
```dart
items: provider.roles.map((r) => DropdownMenuItem(value: r, child: Text(r))).toList(),
```

---

### 2.5 Skills Selection

Skills use a custom error approach because `FilterChip` / `GestureDetector` are not `FormField` widgets:

```dart
final skillsValid = _selectedSkills.isNotEmpty;
setState(() => _skillsError = !skillsValid);
```

The error message is rendered conditionally:

```dart
if (_skillsError)
  Text('Please select at least one skill.',
       style: TextStyle(color: Colors.red, fontSize: 12));
```

**Extending:** To enforce a maximum:
```dart
if (_selectedSkills.length >= 5) {
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Maximum 5 skills allowed.')));
  return;
}
_selectedSkills.add(name);
```

---

### 2.6 Experience Slider

The slider is not validated (any value 0–20 is valid), but its state is communicated via a live label and level badges. The label helper:

```dart
String get _expLabel {
  final y = _experienceYears.toInt();
  if (y == 0) return 'Fresher';
  return y == 1 ? '1 year' : '$y years';
}
```

**Why `toInt()`?** `divisions: 20` on a `Slider` with `min: 0, max: 20` produces integer values at runtime, but the `value` field is `double`. `toInt()` guarantees the display is always a whole number.

---

### 2.7 Resume Filename

```dart
final lower = v.trim().toLowerCase();
if (!lower.endsWith('.pdf') && !lower.endsWith('.docx'))
  return 'Filename must end with .pdf or .docx';
```

**Why `.toLowerCase()`?** Allows `Resume.PDF`, `cv.PDF`, `document.DOCX` to pass — users on Windows often encounter UPPERCASE extensions.

**Extending:** To allow additional formats:
```dart
const allowed = ['.pdf', '.docx', '.doc', '.rtf'];
if (!allowed.any((ext) => lower.endsWith(ext)))
  return 'Unsupported format. Use: ${allowed.join(", ")}';
```

---

### 2.8 Confirmation Checkbox

```dart
final confirmValid = _confirmed;
setState(() => _confirmedError = !confirmValid);
if (!confirmValid) return;
```

The checkbox value is a plain `bool` field, not wrapped in a `FormField`. This is intentional — checkboxes do not benefit from the `Form.validate()` pattern as much as text fields do.

---

## 3. Adding New Validators

To add a new validated field to the form:

1. Declare a `TextEditingController` and dispose it in `dispose()`.
2. Add a `TextFormField` inside the `Form` widget tree.
3. Implement the `validator` function.
4. The field will participate automatically in `_formKey.currentState!.validate()`.

**Template:**

```dart
TextFormField(
  controller: _myNewCtrl,
  decoration: const InputDecoration(labelText: 'My Field *'),
  validator: (v) {
    if (v == null || v.trim().isEmpty) return 'This field is required.';
    // Add your custom rule here
    return null; // null = valid
  },
),
```

---

## 4. Internationalisation of Error Messages

All error strings are currently hard-coded in English. To support multiple languages:

1. Add `flutter_localizations` to `pubspec.yaml`.
2. Add `localizationsDelegates` and `supportedLocales` to `MaterialApp`.
3. Replace string literals with `AppLocalizations.of(context)!.fieldRequired` equivalents.

---

## 5. Testing Validation

Run the widget test suite:

```bash
flutter test
```

To test a specific validator manually:

```dart
// Example unit test for the email validator
test('Email validator rejects missing @', () {
  final result = emailValidator('notanemail');
  expect(result, 'Enter a valid email.');
});
```

---

## 6. Known Accuracy Gaps

| Gap | Description | Suggested Fix |
|-----|-------------|---------------|
| Email domain not verified | `user@fakeddomain.xyz` passes regex | Use an email verification API in production |
| Phone country not enforced | Any 7–15 digit number is accepted | Add country-code dropdown |
| Resume not inspected | Only the filename string is validated | Use `file_picker` package for real file access |
| No duplicate detection | Users can submit multiple identical forms | Add session-based deduplication |

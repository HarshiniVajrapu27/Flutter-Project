# Accuracy Enhancement Summary

**Project:** SkillApply — Smart Job Application Form  
**Document Purpose:** Summary of all form validation and input accuracy improvements  
**Version:** 1.0.0  

---

## Overview

This document summarises the accuracy enhancements applied to the SkillApply job application form. The goal is to ensure that every value collected from an applicant is as correct, complete, and consistent as possible before it is stored in local application state.

Accuracy in a job application context means:
- Required fields cannot be left blank.
- Text inputs are sanitised to remove accidental whitespace or invalid characters.
- Email and phone values conform to real-world formats.
- Dropdown and chip selections are enforced so that the submission always includes a valid role and at least one skill.
- The confirmation checkbox prevents accidental or insincere submissions.

---

## 1. Full Name Validation

| Rule | Detail |
|------|--------|
| **Required** | A non-empty value must be entered. |
| **Minimum length** | At least 2 characters after trimming whitespace. |
| **Auto-capitalisation** | `TextCapitalization.words` is applied so each word starts with a capital letter on mobile keyboards. |
| **No format constraint** | Hyphenated names, compound names, and names with accents are accepted. |

**Error message returned:** `"Full name is required."` / `"Name must be at least 2 characters."`

---

## 2. Email Validation

| Rule | Detail |
|------|--------|
| **Required** | A non-empty value must be entered. |
| **Format check** | Regex `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$` |
| **Whitespace prevention** | `FilteringTextInputFormatter.deny(RegExp(r'\s'))` blocks spaces as the user types. |
| **Keyboard hint** | `TextInputType.emailAddress` shows the `@` key on mobile keyboards. |

**Accuracy rationale:** The regex enforces the local-part, `@` symbol, domain, and top-level-domain segments. It rejects obvious typos like `user@`, `@domain.com`, and `user@domain`.

---

## 3. Phone Number Validation

| Rule | Detail |
|------|--------|
| **Required** | A non-empty value must be entered. |
| **Digit count** | Between 7 and 15 digits (after stripping non-digits). |
| **Allowed characters** | Digits `0-9`, `+`, `-`, spaces, and parentheses via `FilteringTextInputFormatter`. |
| **International support** | The `+` prefix allows country codes (e.g., `+91`, `+1`). |

**Accuracy rationale:** The 7–15 digit range aligns with ITU-T E.164 international numbering (minimum 7 digits for local numbers; maximum 15 for full international format).

---

## 4. Job Role Dropdown Validation

| Rule | Detail |
|------|--------|
| **Required** | The dropdown must have a non-null selection. |
| **Predefined list** | Restricts input to six specific roles, preventing free-text typos. |
| **Validator** | Returns `"Please select a job role."` if null is detected on submit. |

---

## 5. Skills Selection Accuracy

| Rule | Detail |
|------|--------|
| **Minimum one** | At least one skill chip must be toggled before submission. |
| **Custom error** | Displayed below the chip grid (not via `TextFormField.validator`). |
| **State management** | Stored in a `Set<String>` — duplicates are impossible by design. |
| **Immediate feedback** | The error clears as soon as the user selects a skill. |

---

## 6. Experience Slider Accuracy

| Rule | Detail |
|------|--------|
| **Range** | 0 to 20 (integer steps via `divisions: 20`). |
| **Label update** | The displayed label updates synchronously on every `onChanged` event. |
| **Fresher special case** | `0` is labelled `"Fresher"` instead of `"0 years"` for clarity. |
| **Level badges** | Five contextual badges (Fresher, Junior, Mid, Senior, Expert) highlight the current range automatically. |

---

## 7. Resume Filename Validation

| Rule | Detail |
|------|--------|
| **Required** | A non-empty value must be entered. |
| **Extension check** | Filename must end with `.pdf` or `.docx` (case-insensitive via `.toLowerCase()`). |
| **No upload** | The field records the filename string only; no binary data is handled. |
| **Helper text** | Inline helper text reminds the user of the expected format. |

---

## 8. Cover Letter (Optional Field)

| Rule | Detail |
|------|--------|
| **Optional** | No validator is attached; the field may be left blank. |
| **Character limit** | `maxLength: 600` enforced by Flutter's `TextField`. |
| **Counter** | Flutter's built-in character counter is displayed automatically. |

---

## 9. Confirmation Checkbox

| Rule | Detail |
|------|--------|
| **Required** | The boolean `_confirmed` must be `true` before submission proceeds. |
| **Error display** | An inline red text message appears below the checkbox if unchecked. |
| **State reset** | Cleared by the Reset Form button. |

---

## 10. Summary

All validation rules are evaluated in a single `_submit()` call:

1. `_formKey.currentState!.validate()` — triggers all `TextFormField` validators.
2. `_selectedSkills.isNotEmpty` — custom skills check.
3. `_confirmed == true` — confirmation check.

Submission only proceeds when all three conditions are `true`. This ensures no partial or inaccurate application can reach the success screen.

---

## Known Limitations

- Email and phone validation is client-side only; domain existence is not verified.
- The resume filename is accepted as typed; the actual file is never inspected.
- No server-side re-validation is performed.
- Form data lives in Flutter widget state and is lost on page refresh.

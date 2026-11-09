# Cleanup Summary

**Project:** SkillApply — Smart Job Application Form  
**Document Purpose:** Record of code cleanup, refactoring, and dead-code removal decisions  
**Version:** 1.0.0  

---

## Overview

This document records the cleanup and refactoring decisions made during the development of the SkillApply Flutter Web job application form. Cleanup work ensures the codebase is readable, maintainable, and free from unused imports, dead code, and unnecessary dependencies.

---

## 1. Dependencies Removed

The original project scaffold contained references to several third-party packages. All were removed to maximise FlutLab.io compatibility and minimise bundle size.

| Package Removed | Reason |
|-----------------|--------|
| `flutter_animate` | Replaced with Flutter's built-in `AnimatedContainer` and `AnimatedSwitcher`. |
| `google_fonts` | Removed; Roboto is Flutter's default Material font. |
| `provider` | Removed; replaced with `setState()` which is sufficient for a single-form app. |

**Result:** `pubspec.yaml` now lists only `flutter: sdk: flutter` and `cupertino_icons` as dependencies.

---

## 2. File Structure Cleanup

### Removed Folders / Files

The prior version of this project contained multiple source sub-directories that are no longer needed:

| Path Removed | Reason |
|--------------|--------|
| `lib/models/` | `JobApplication` model merged inline into `_JobApplicationFormState`. |
| `lib/providers/` | `ApplicationProvider` removed; replaced with local `setState()`. |
| `lib/screens/` | All screens consolidated into `lib/main.dart`. |
| `lib/theme/` | `AppTheme` class removed; theme defined directly in `ThemeData`. |
| `lib/widgets/` | Step widgets removed; all form sections implemented as private methods. |

### Single-File Architecture

All application code now lives in `lib/main.dart`. This choice was deliberate:
- Reduces friction for students copying the project into FlutLab.io.
- Eliminates relative-import path issues across platforms.
- Keeps the codebase easy to read from top to bottom.

---

## 3. Widget Cleanup

### Removed Widgets / Screens

| Widget / Screen | Reason for Removal |
|-----------------|--------------------|
| `SplashScreen` (TalentBridge) | Replaced with immediate navigation to the form. App name changed to SkillApply. |
| `HomeScreen` | Retained as a minimal `JobApplicationScreen` wrapper. |
| `PageController` multi-step form | Replaced with a single scrollable card for simplicity. |
| `StepIndicator` widget | Removed; single-page form does not require step navigation. |
| `ProfessionalInfoStep` | Merged into `_buildPersonalSection()`. |
| `ReviewStep` | Replaced by `_buildSuccessCard()` after submission. |

---

## 4. State Management Cleanup

### Before

The project used the `provider` package with a `ChangeNotifier`-based `ApplicationProvider`. This introduced:
- An extra file (`lib/providers/application_provider.dart`).
- Build-context dependency injection.
- Boilerplate `Consumer<T>` wrappers.

### After

All state is held directly in `_JobApplicationFormState` using standard Flutter `setState()`:

```dart
// Example — toggling a skill
setState(() {
  _selectedSkills.contains(name)
      ? _selectedSkills.remove(name)
      : _selectedSkills.add(name);
});
```

This approach is beginner-friendly, transparent, and requires no additional packages.

---

## 5. Naming Cleanup

| Old Name | New Name | Reason |
|----------|----------|--------|
| `TalentBridge` | `SkillApply` | Matches the project brief. |
| `JobApplicationApp` (MaterialApp) | `JobApplicationApp` | Retained — name is appropriate. |
| `ApplicationFormScreen` | `JobApplicationScreen` | Clearer noun describing the outer scaffold. |
| `PersonalInfoStep` | `_buildPersonalSection()` | Private method; no separate widget needed. |
| `_resumeNameController` | `_resumeCtrl` | Shorter, consistent controller naming convention. |

---

## 6. Theme Cleanup

| Old Palette | New Palette | Reason |
|-------------|-------------|--------|
| Dark background (`#0A0E27`) | Light background (`#F5F7FA`) | Matches the project brief (light/white design). |
| Purple/Cyan (`#6C63FF`, `#00D4FF`) | Blue/Purple (`#1565C0`, `#7B1FA2`) | Professional, accessible blue + purple palette. |
| Dark card (`#1E2340`) | White card (`#FFFFFF`) | More readable on web; standard form appearance. |

---

## 7. Web Configuration Cleanup

| File | Change Made |
|------|-------------|
| `web/index.html` | Title updated from `TalentBridge` to `SkillApply`. Meta description updated. Loading spinner added. |
| `web/manifest.json` | Created. `name`, `short_name`, and `theme_color` set to match SkillApply branding. |

---

## 8. Code Quality

- All `TextEditingController` instances are disposed in `dispose()`.
- No `print()` statements remain in production code.
- All `withOpacity()` calls use named constants where possible.
- `const` constructors are used wherever the widget tree is static.
- `null-safe` Dart is used throughout; no `!` force-unwraps on user input.

---

## Summary

| Category | Before | After |
|----------|--------|-------|
| Dart files in `lib/` | 12 | 1 |
| Third-party packages | 3 (`provider`, `google_fonts`, `flutter_animate`) | 0 |
| Lines of code (lib/) | ~2,400 | ~590 |
| Theme | Dark | Light (blue + purple) |
| App name | TalentBridge | SkillApply |

// =============================================================================
//  SkillApply — Job Application Form (Flutter Web)
//  File      : lib/main.dart
//  Purpose   : Complete, single-file Flutter Web job application form.
//  Features  : Personal info, job role dropdown, skill chips, experience
//              slider, resume filename, cover letter, confirmation checkbox,
//              validation, success summary, and form reset.
//  SDG Link  : UN SDG 8 — Decent Work & Economic Growth
//  Packages  : Flutter SDK only — no third-party dependencies.
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// ─── Entry point ──────────────────────────────────────────────────────────────
void main() {
  runApp(const JobApplicationApp());
}

// ─── App root ─────────────────────────────────────────────────────────────────
class JobApplicationApp extends StatelessWidget {
  const JobApplicationApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SkillApply — Job Application Form',
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(),
      home: const JobApplicationScreen(),
    );
  }

  /// Builds the Material 3 theme: white background, blue + purple accents.
  ThemeData _buildTheme() {
    const Color primaryBlue  = Color(0xFF1565C0);
    const Color accentPurple = Color(0xFF7B1FA2);

    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryBlue,
        primary:   primaryBlue,
        secondary: accentPurple,
        surface:   Colors.white,   // 'background' deprecated since v3.18 — use surface
      ),
      scaffoldBackgroundColor: const Color(0xFFF5F7FA),
      fontFamily: 'Roboto',
      // AppBar
      appBarTheme: const AppBarTheme(
        backgroundColor: primaryBlue,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.white,
          letterSpacing: 0.5,
        ),
      ),
      // ElevatedButton
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
          elevation: 2,
        ),
      ),
      // OutlinedButton
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryBlue,
          side: const BorderSide(color: primaryBlue, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
        ),
      ),
      // Input fields
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        border:        OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCCCCCC))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFCCCCCC))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: primaryBlue, width: 2)),
        errorBorder:   OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Colors.red)),
        focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Colors.red, width: 2)),
        labelStyle: const TextStyle(color: Color(0xFF555555)),
        hintStyle:  const TextStyle(color: Color(0xFFAAAAAA), fontSize: 14),
        errorStyle: const TextStyle(fontSize: 12),
      ),
    );
  }
}

// ─── Outer scaffold ────────────────────────────────────────────────────────────
class JobApplicationScreen extends StatelessWidget {
  const JobApplicationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.work_outline_rounded, size: 22),
            SizedBox(width: 10),
            Text('SkillApply'),
          ],
        ),
      ),
      backgroundColor: const Color(0xFFF5F7FA),
      body: const SafeArea(
        child: SingleChildScrollView(
          child: Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 32, horizontal: 16),
              child: JobApplicationForm(),
            ),
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  JobApplicationForm — main stateful widget
// ═══════════════════════════════════════════════════════════════════════════════
class JobApplicationForm extends StatefulWidget {
  const JobApplicationForm({super.key});

  @override
  State<JobApplicationForm> createState() => _JobApplicationFormState();
}

class _JobApplicationFormState extends State<JobApplicationForm> {
  // ── Form state ───────────────────────────────────────────────────────────
  final _formKey = GlobalKey<FormState>();

  // ── Text controllers ─────────────────────────────────────────────────────
  final _nameCtrl        = TextEditingController();
  final _emailCtrl       = TextEditingController();
  final _phoneCtrl       = TextEditingController();
  final _resumeCtrl      = TextEditingController();
  final _coverLetterCtrl = TextEditingController();

  // ── Dropdown ─────────────────────────────────────────────────────────────
  String? _selectedRole;

  static const List<String> _roles = [
    'Software Developer',
    'Web Developer',
    'Flutter Developer',
    'UI/UX Designer',
    'Data Analyst',
    'Other',
  ];

  // ── Skills ───────────────────────────────────────────────────────────────
  static const List<Map<String, String>> _allSkills = [
    {'name': 'Java',            'icon': '☕'},
    {'name': 'Python',          'icon': '🐍'},
    {'name': 'Dart',            'icon': '🎯'},
    {'name': 'Flutter',         'icon': '📱'},
    {'name': 'HTML/CSS',        'icon': '🌐'},
    {'name': 'JavaScript',      'icon': '⚡'},
    {'name': 'SQL',             'icon': '🗄️'},
    {'name': 'Git/GitHub',      'icon': '📦'},
    {'name': 'Communication',   'icon': '🗣️'},
    {'name': 'Problem Solving', 'icon': '💡'},
  ];

  final Set<String> _selectedSkills = {};
  bool _skillsError = false; // shows error when no skill is selected on submit

  // ── Experience slider ─────────────────────────────────────────────────────
  double _experienceYears = 0;

  // ── Confirmation checkbox ─────────────────────────────────────────────────
  bool _confirmed = false;
  bool _confirmedError = false;

  // ── Submission state ──────────────────────────────────────────────────────
  bool _isSubmitting = false;
  bool _submitted    = false;

  // ── Theme colours (convenience) ───────────────────────────────────────────
  static const Color _blue   = Color(0xFF1565C0);
  static const Color _purple = Color(0xFF7B1FA2);

  // ─────────────────────────────────────────────────────────────────────────
  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _resumeCtrl.dispose();
    _coverLetterCtrl.dispose();
    super.dispose();
  }

  // ── Experience label ──────────────────────────────────────────────────────
  String get _expLabel {
    final y = _experienceYears.toInt();
    if (y == 0) return 'Fresher';
    return y == 1 ? '1 year' : '$y years';
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  Future<void> _submit() async {
    // 1 — form field validators
    final formValid = _formKey.currentState!.validate();

    // 2 — skills
    final skillsValid = _selectedSkills.isNotEmpty;
    setState(() => _skillsError = !skillsValid);

    // 3 — confirmation checkbox
    final confirmValid = _confirmed;
    setState(() => _confirmedError = !confirmValid);

    if (!formValid || !skillsValid || !confirmValid) return;

    // 4 — simulate brief processing
    setState(() => _isSubmitting = true);
    await Future<void>.delayed(const Duration(seconds: 2)); // explicit type arg required
    setState(() {
      _isSubmitting = false;
      _submitted    = true;
    });
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  void _reset() {
    _formKey.currentState?.reset();
    _nameCtrl.clear();
    _emailCtrl.clear();
    _phoneCtrl.clear();
    _resumeCtrl.clear();
    _coverLetterCtrl.clear();
    setState(() {
      _selectedRole     = null;
      _selectedSkills.clear();
      _experienceYears  = 0;
      _confirmed        = false;
      _skillsError      = false;
      _confirmedError   = false;
      _isSubmitting     = false;
      _submitted        = false;
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    // Responsive card width: ≤600 → full width; else max 700 px
    final screenWidth = MediaQuery.of(context).size.width;
    final cardWidth   = screenWidth < 640 ? screenWidth - 32 : 700.0;

    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: cardWidth),
      child: _submitted ? _buildSuccessCard() : _buildFormCard(),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  FORM CARD
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildFormCard() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Heading ─────────────────────────────────────────────────
              _buildFormHeading(),
              const SizedBox(height: 32),

              // ── A: Personal Information ──────────────────────────────────
              _buildSectionHeader(
                  'A', 'Personal Information', Icons.person_outline, _blue),
              const SizedBox(height: 18),
              _buildPersonalSection(),
              const SizedBox(height: 28),

              // ── B: Skills ────────────────────────────────────────────────
              _buildSectionHeader(
                  'B', 'Skills', Icons.code_rounded, _purple),
              const SizedBox(height: 14),
              _buildSkillsSection(),
              const SizedBox(height: 28),

              // ── C: Experience ────────────────────────────────────────────
              _buildSectionHeader(
                  'C', 'Years of Experience', Icons.timeline_rounded, _blue),
              const SizedBox(height: 14),
              _buildExperienceSection(),
              const SizedBox(height: 28),

              // ── D: Resume ────────────────────────────────────────────────
              _buildSectionHeader(
                  'D', 'Resume', Icons.description_outlined, _purple),
              const SizedBox(height: 14),
              _buildResumeSection(),
              const SizedBox(height: 28),

              // ── E: Additional Information ────────────────────────────────
              _buildSectionHeader(
                  'E', 'Additional Information', Icons.notes_rounded, _blue),
              const SizedBox(height: 14),
              _buildAdditionalSection(),
              const SizedBox(height: 32),

              // ── F: Buttons ───────────────────────────────────────────────
              _buildButtons(),
            ],
          ),
        ),
      ),
    );
  }

  // ── Form heading ────────────────────────────────────────────────────────────
  Widget _buildFormHeading() {
    return Column(
      children: [
        // Gradient icon
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [_blue, _purple],
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: _blue.withValues(alpha: 0.3),
                blurRadius: 16,
                offset: const Offset(0, 6),
              )
            ],
          ),
          child: const Icon(Icons.work_outline_rounded,
              color: Colors.white, size: 38),
        ),
        const SizedBox(height: 18),
        const Text(
          'Job Application Form',
          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A1A2E),
            letterSpacing: 0.3,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        const Text(
          'Take the next step in your career.',
          style: TextStyle(fontSize: 15, color: Color(0xFF666688)),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 18),
      ],
    );
  }

  // ── Section header widget ───────────────────────────────────────────────────
  Widget _buildSectionHeader(
      String letter, String title, IconData icon, Color color) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Text(letter,
              style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 15)),
        ),
        const SizedBox(width: 12),
        Icon(icon, size: 20, color: color),
        const SizedBox(width: 8),
        Text(title,
            style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: color)),
        const SizedBox(width: 8),
        Expanded(child: Divider(color: color.withValues(alpha: 0.25), thickness: 1.5)),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION A — Personal Information
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildPersonalSection() {
    return LayoutBuilder(builder: (context, constraints) {
      // Two-column layout for wider screens
      final wide = constraints.maxWidth > 500;
      return Column(
        children: [
          // Full Name
          TextFormField(
            controller: _nameCtrl,
            textCapitalization: TextCapitalization.words,
            decoration: const InputDecoration(
              labelText: 'Full Name *',
              hintText: 'e.g. Krithi Gupta',
              prefixIcon: Icon(Icons.person_outline),
            ),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Full name is required.';
              if (v.trim().length < 2) return 'Name must be at least 2 characters.';
              return null;
            },
          ),
          const SizedBox(height: 14),
          // Email + Phone (side-by-side on wide, stacked on narrow)
          wide
              ? Row(
                  children: [
                    Expanded(child: _buildEmailField()),
                    const SizedBox(width: 14),
                    Expanded(child: _buildPhoneField()),
                  ],
                )
              : Column(
                  children: [
                    _buildEmailField(),
                    const SizedBox(height: 14),
                    _buildPhoneField(),
                  ],
                ),
          const SizedBox(height: 14),
          // Job Role dropdown
          _buildRoleDropdown(),
        ],
      );
    });
  }

  Widget _buildEmailField() {
    return TextFormField(
      controller: _emailCtrl,
      keyboardType: TextInputType.emailAddress,
      inputFormatters: [FilteringTextInputFormatter.deny(RegExp(r'\s'))],
      decoration: const InputDecoration(
        labelText: 'Email Address *',
        hintText: 'name@example.com',
        prefixIcon: Icon(Icons.email_outlined),
      ),
      validator: (v) {
        if (v == null || v.trim().isEmpty) return 'Email is required.';
        final ok = RegExp(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$');
        if (!ok.hasMatch(v.trim())) return 'Enter a valid email.';
        return null;
      },
    );
  }

  Widget _buildPhoneField() {
    return TextFormField(
      controller: _phoneCtrl,
      keyboardType: TextInputType.phone,
      inputFormatters: [
        FilteringTextInputFormatter.allow(RegExp(r'[0-9+\-\s()]'))
      ],
      decoration: const InputDecoration(
        labelText: 'Phone Number *',
        hintText: '+91 98765 43210',
        prefixIcon: Icon(Icons.phone_outlined),
      ),
      validator: (v) {
        if (v == null || v.trim().isEmpty) return 'Phone is required.';
        final digits = v.replaceAll(RegExp(r'\D'), '');
        if (digits.length < 7 || digits.length > 15) {
          return 'Enter a valid phone (7–15 digits).';
        }
        return null;
      },
    );
  }

  Widget _buildRoleDropdown() {
    return DropdownButtonFormField<String>(
      initialValue: _selectedRole, // 'value' deprecated since v3.33 — use initialValue
      isExpanded: true,
      decoration: const InputDecoration(
        labelText: 'Job Role *',
        prefixIcon: Icon(Icons.business_center_outlined),
      ),
      icon: const Icon(Icons.keyboard_arrow_down_rounded, color: _blue),
      items: _roles
          .map((r) => DropdownMenuItem(
                value: r,
                child: Text(r, style: const TextStyle(fontSize: 14)),
              ))
          .toList(),
      onChanged: (v) => setState(() => _selectedRole = v),
      validator: (v) => v == null ? 'Please select a job role.' : null,
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION B — Skills
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildSkillsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select all skills that apply. At least one is required.',
          style: TextStyle(fontSize: 13, color: Color(0xFF666688)),
        ),
        const SizedBox(height: 12),
        // Skill chip grid
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: _allSkills.map((skill) {
            final name     = skill['name']!;
            final icon     = skill['icon']!;
            final selected = _selectedSkills.contains(name);
            return _SkillChip(
              label:    name,
              emoji:    icon,
              selected: selected,
              onTap: () => setState(() {
                selected
                    ? _selectedSkills.remove(name)
                    : _selectedSkills.add(name);
                _skillsError = false;
              }),
            );
          }).toList(),
        ),
        // Error message
        if (_skillsError)
          const Padding(
            padding: EdgeInsets.only(top: 8),
            child: Row(
              children: [
                Icon(Icons.error_outline, size: 14, color: Colors.red),
                SizedBox(width: 4),
                Text('Please select at least one skill.',
                    style: TextStyle(color: Colors.red, fontSize: 12)),
              ],
            ),
          ),
        if (_selectedSkills.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Text(
              '${_selectedSkills.length} skill${_selectedSkills.length > 1 ? "s" : ""} selected',
              style: const TextStyle(
                  fontSize: 12, color: _blue, fontWeight: FontWeight.w600),
            ),
          ),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION C — Experience Slider
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildExperienceSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F6FF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _blue.withValues(alpha: 0.18)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Label + badge row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Years of Experience',
                  style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                      color: Color(0xFF333355))),
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: Container(
                  key: ValueKey(_experienceYears),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [_blue, _purple],
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    _expLabel,
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 13),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Slider
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              activeTrackColor:   _blue,
              inactiveTrackColor: const Color(0xFFBBCCEE),
              thumbColor:         _purple,
              overlayColor:       _purple.withValues(alpha: 0.12),
              valueIndicatorColor: _blue,
              trackHeight:  6,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 12),
              overlayShape: const RoundSliderOverlayShape(overlayRadius: 24),
              valueIndicatorTextStyle: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold),
              showValueIndicator: ShowValueIndicator.onDrag, // 'always' deprecated since v3.28
            ),
            child: Slider(
              value:     _experienceYears,
              min:       0,
              max:       20,
              divisions: 20,
              label:     _expLabel,
              onChanged: (v) => setState(() => _experienceYears = v),
            ),
          ),
          // Min / Max labels
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('0 yrs', style: TextStyle(fontSize: 11, color: Color(0xFF8899AA))),
                Text('20 yrs', style: TextStyle(fontSize: 11, color: Color(0xFF8899AA))),
              ],
            ),
          ),
          const SizedBox(height: 12),
          // Level indicator badges
          Row(
            children: [
              _ExpBadge('Fresher', active: _experienceYears == 0, color: Colors.green),
              _ExpBadge('Junior',  active: _experienceYears >= 1 && _experienceYears <= 3, color: Colors.teal),
              _ExpBadge('Mid',     active: _experienceYears >= 4 && _experienceYears <= 7, color: _blue),
              _ExpBadge('Senior',  active: _experienceYears >= 8 && _experienceYears <= 14, color: _purple),
              _ExpBadge('Expert',  active: _experienceYears >= 15, color: Colors.deepOrange),
            ],
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION D — Resume
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildResumeSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Disclaimer banner
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF8E1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.amber.shade300, width: 1.2),
          ),
          child: const Row(
            children: [
              Icon(Icons.info_outline, size: 16, color: Colors.amber),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'This form records your resume filename only. No actual file is uploaded.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF5D4037)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        TextFormField(
          controller: _resumeCtrl,
          decoration: const InputDecoration(
            labelText: 'Resume File Name *',
            hintText: 'e.g. Harshini_Resume.pdf',
            prefixIcon: Icon(Icons.description_outlined),
            helperText: 'Enter the filename of your resume (must end in .pdf or .docx).',
            helperMaxLines: 2,
          ),
          validator: (v) {
            if (v == null || v.trim().isEmpty) return 'Resume filename is required.';
            final lower = v.trim().toLowerCase();
            if (!lower.endsWith('.pdf') && !lower.endsWith('.docx')) {
              return 'Filename must end with .pdf or .docx';
            }
            return null;
          },
        ),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION E — Additional Information
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildAdditionalSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Cover letter
        TextFormField(
          controller: _coverLetterCtrl,
          maxLines: 5,
          maxLength: 600,
          decoration: const InputDecoration(
            labelText: 'Cover Letter / Additional Information',
            hintText: 'Tell us why you are the ideal candidate for this role…',
            prefixIcon: Padding(
              padding: EdgeInsets.only(bottom: 80),
              child: Icon(Icons.notes_rounded),
            ),
            alignLabelWithHint: true,
            helperText: 'Optional — up to 600 characters.',
          ),
        ),
        const SizedBox(height: 12),
        // Confirmation checkbox
        GestureDetector(
          onTap: () => setState(() {
            _confirmed = !_confirmed;
            _confirmedError = false;
          }),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: _confirmed ? _blue : Colors.white,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: _confirmedError
                        ? Colors.red
                        : (_confirmed ? _blue : const Color(0xFFBBBBCC)),
                    width: 2,
                  ),
                ),
                child: _confirmed
                    ? const Icon(Icons.check_rounded, color: Colors.white, size: 16)
                    : null,
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'I confirm that the information provided is accurate and complete. *',
                  style: TextStyle(fontSize: 14, color: Color(0xFF444455), height: 1.4),
                ),
              ),
            ],
          ),
        ),
        if (_confirmedError)
          const Padding(
            padding: EdgeInsets.only(top: 6, left: 36),
            child: Text(
              'Please confirm the accuracy of your information.',
              style: TextStyle(color: Colors.red, fontSize: 12),
            ),
          ),
      ],
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SECTION F — Buttons
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildButtons() {
    return LayoutBuilder(builder: (context, constraints) {
      final wide = constraints.maxWidth > 400;
      final submitBtn = SizedBox(
        width: wide ? null : double.infinity,
        child: ElevatedButton.icon(
          onPressed: _isSubmitting ? null : _submit,
          icon: _isSubmitting
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                      color: Colors.white, strokeWidth: 2.5))
              : const Icon(Icons.send_rounded, size: 18),
          label: Text(_isSubmitting ? 'Submitting…' : 'Submit Application'),
        ),
      );

      final resetBtn = SizedBox(
        width: wide ? null : double.infinity,
        child: OutlinedButton.icon(
          onPressed: _isSubmitting ? null : _reset,
          icon: const Icon(Icons.refresh_rounded, size: 18),
          label: const Text('Reset Form'),
        ),
      );

      return wide
          ? Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [resetBtn, const SizedBox(width: 16), submitBtn],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [submitBtn, const SizedBox(height: 12), resetBtn],
            );
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SUCCESS CARD
  // ═══════════════════════════════════════════════════════════════════════════
  Widget _buildSuccessCard() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            // Animated check icon
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                    colors: [Color(0xFF00897B), Color(0xFF26A69A)]),
                boxShadow: [
                   BoxShadow(
                      color: Colors.teal.withValues(alpha: 0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 6))
                ],
              ),
              child: const Icon(Icons.check_rounded,
                  color: Colors.white, size: 48),
            ),
            const SizedBox(height: 24),
            const Text(
              'Application Submitted! 🎉',
              style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1A1A2E)),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Your details have been recorded in this session.\n'
              'Our team will review and contact you within 3–5 business days.',
              style: TextStyle(fontSize: 14, color: Color(0xFF666688), height: 1.5),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),
            // Summary card
            _buildSummaryCard(),
            const SizedBox(height: 28),
            // Action buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                OutlinedButton.icon(
                  onPressed: _reset,
                  icon: const Icon(Icons.add_circle_outline),
                  label: const Text('New Application'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F7FA),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFDDE0EE), width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          const Row(
            children: [
              Icon(Icons.summarize_outlined, size: 18, color: _blue),
              SizedBox(width: 8),
              Text('Application Summary',
                  style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: _blue)),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(),
          const SizedBox(height: 10),
          _SummaryRow(icon: Icons.person_outline,    label: 'Name',       value: _nameCtrl.text.trim()),
          _SummaryRow(icon: Icons.email_outlined,    label: 'Email',      value: _emailCtrl.text.trim()),
          _SummaryRow(icon: Icons.phone_outlined,    label: 'Phone',      value: _phoneCtrl.text.trim()),
          _SummaryRow(icon: Icons.work_outline,      label: 'Role',       value: _selectedRole ?? '—'),
          _SummaryRow(icon: Icons.timeline_rounded,  label: 'Experience', value: _expLabel),
          _SummaryRow(
              icon: Icons.description_outlined,
              label: 'Resume',
              value: _resumeCtrl.text.trim().isEmpty ? '—' : _resumeCtrl.text.trim()),
          const SizedBox(height: 10),
          // Skills
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.code_rounded, size: 16, color: Color(0xFF7B1FA2)),
              const SizedBox(width: 10),
              const SizedBox(
                width: 90,
                child: Text('Skills',
                    style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF888899),
                        fontWeight: FontWeight.w500)),
              ),
              Expanded(
                child: Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: _selectedSkills
                      .map((s) => Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                  colors: [_blue, _purple]),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(s,
                                style: const TextStyle(
                                    fontSize: 11,
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold)),
                          ))
                      .toList(),
                ),
              ),
            ],
          ),
          if (_coverLetterCtrl.text.trim().isNotEmpty) ...[
            const SizedBox(height: 10),
            _SummaryRow(
                icon: Icons.notes_rounded,
                label: 'Cover Letter',
                value: _coverLetterCtrl.text.trim()),
          ],
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  REUSABLE WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

/// Animated selectable chip for skill selection.
class _SkillChip extends StatelessWidget {
  final String label;
  final String emoji;
  final bool selected;
  final VoidCallback onTap;

  const _SkillChip({
    required this.label,
    required this.emoji,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    const blue   = Color(0xFF1565C0);
    const purple = Color(0xFF7B1FA2);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          gradient: selected
              ? const LinearGradient(colors: [blue, purple])
              : null,
          color: selected ? null : Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(
            color: selected ? Colors.transparent : const Color(0xFFBBBBCC),
            width: 1.5,
          ),
          boxShadow: selected
              ? [BoxShadow(color: blue.withValues(alpha: 0.22), blurRadius: 8, offset: const Offset(0, 3))]
              : [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4)],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 15)),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                color: selected ? Colors.white : const Color(0xFF444455),
              ),
            ),
            if (selected) ...[
              const SizedBox(width: 5),
              const Icon(Icons.check_circle_rounded,
                  size: 14, color: Colors.white),
            ],
          ],
        ),
      ),
    );
  }
}

/// Animated experience-level badge below the slider.
class _ExpBadge extends StatelessWidget {
  final String label;
  final bool active;
  final Color color;

  const _ExpBadge(this.label, {required this.active, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        margin: const EdgeInsets.symmetric(horizontal: 2),
        padding: const EdgeInsets.symmetric(vertical: 5),
        decoration: BoxDecoration(
          color: active ? color.withValues(alpha: 0.14) : const Color(0xFFF0F0F5),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: active ? color : const Color(0xFFDDDDEE),
            width: active ? 1.5 : 1,
          ),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 10,
            fontWeight: active ? FontWeight.bold : FontWeight.normal,
            color: active ? color : const Color(0xFFAAAAAA),
          ),
        ),
      ),
    );
  }
}

/// Label + value row used in the success summary card.
class _SummaryRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _SummaryRow(
      {required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 15, color: const Color(0xFF00897B)),
          const SizedBox(width: 10),
          SizedBox(
            width: 90,
            child: Text(label,
                style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF888899),
                    fontWeight: FontWeight.w500)),
          ),
          Expanded(
            child: Text(
              value.isEmpty ? '—' : value,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF222233)),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}

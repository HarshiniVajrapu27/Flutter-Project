// Basic widget tests for SkillApply — Job Application Form.
//
// These tests verify that the app builds, key widgets render, and
// the form responds to user interaction.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:skill_apply/main.dart'; // package name matches pubspec.yaml

void main() {
  // Use a larger test surface so the scrollable form fits
  const testSize = Size(800, 2400);

  testWidgets('App renders without errors', (WidgetTester tester) async {
    tester.view.physicalSize = testSize;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() => tester.view.resetPhysicalSize());

    await tester.pumpWidget(const JobApplicationApp());
    await tester.pumpAndSettle();

    // The AppBar title 'SkillApply' should be visible.
    expect(find.text('SkillApply'), findsOneWidget);
  });

  testWidgets('Form heading and subtitle are displayed',
      (WidgetTester tester) async {
    tester.view.physicalSize = testSize;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() => tester.view.resetPhysicalSize());

    await tester.pumpWidget(const JobApplicationApp());
    await tester.pumpAndSettle();

    expect(find.text('Job Application Form'), findsOneWidget);
    expect(
        find.text('Take the next step in your career.'), findsOneWidget);
  });

  testWidgets('Submit and Reset buttons are present',
      (WidgetTester tester) async {
    tester.view.physicalSize = testSize;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() => tester.view.resetPhysicalSize());

    await tester.pumpWidget(const JobApplicationApp());
    await tester.pumpAndSettle();

    expect(find.text('Submit Application'), findsOneWidget);
    expect(find.text('Reset Form'), findsOneWidget);
  });

  testWidgets('Skill chips are rendered', (WidgetTester tester) async {
    tester.view.physicalSize = testSize;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() => tester.view.resetPhysicalSize());

    await tester.pumpWidget(const JobApplicationApp());
    await tester.pumpAndSettle();

    // A few of the expected skill labels should be present.
    expect(find.text('Flutter'), findsOneWidget);
    expect(find.text('Python'), findsOneWidget);
    expect(find.text('SQL'), findsOneWidget);
  });

  testWidgets('Experience slider starts at 0 (Fresher)',
      (WidgetTester tester) async {
    tester.view.physicalSize = testSize;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() => tester.view.resetPhysicalSize());

    await tester.pumpWidget(const JobApplicationApp());
    await tester.pumpAndSettle();

    expect(find.text('Fresher'), findsWidgets); // badge + label
  });

  testWidgets('Tapping Submit with empty fields shows validation errors',
      (WidgetTester tester) async {
    tester.view.physicalSize = testSize;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() => tester.view.resetPhysicalSize());

    await tester.pumpWidget(const JobApplicationApp());
    await tester.pumpAndSettle();

    // Scroll to the bottom so the button is in the live area.
    await tester.scrollUntilVisible(
      find.text('Submit Application'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();

    // Tap Submit without filling in anything.
    await tester.tap(find.text('Submit Application'));
    await tester.pumpAndSettle();

    // At least one validation error should appear.
    expect(find.text('Full name is required.'), findsOneWidget);
    expect(find.text('Email is required.'), findsOneWidget);
  });
}

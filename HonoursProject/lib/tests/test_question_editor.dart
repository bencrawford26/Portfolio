import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/tests/test_question_editor_form.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TestQuestionEditor extends StatelessWidget {
  final User _user;
  final Map _question;
  final int _questionNo;
  final DocumentReference _bank;
  final Firestore _firestore;

  TestQuestionEditor(this._user, this._question, this._questionNo, this._bank,
      this._firestore);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Test Question Editor'),
      ),
      body: TestQuestionEditorForm(_user, _question, _questionNo, _bank, _firestore),
    );
  }
}

import 'package:flutter/material.dart';

import './question_editor_form.dart';
import '../user/user.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class QuestionEditor extends StatelessWidget {
  final User _user;
  final Map _question;
  final int _questionNo;
  final DocumentReference _bank;
  final Firestore firestore;

  QuestionEditor(this._user, this._question, this._questionNo, this._bank, this.firestore);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Question Creator'),
      ),
      body: QuestionEditorForm(_user, _question, _questionNo, _bank, firestore),
    );
  }
}

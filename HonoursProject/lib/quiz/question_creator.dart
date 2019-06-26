import 'package:flutter/material.dart';

import './question_creator_form.dart';
import '../user/user.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class QuestionCreator extends StatelessWidget {
  final User _user;
  final DocumentReference _bank;
  final Firestore firestore;

  QuestionCreator(this._user, this._bank, this.firestore);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Question Creator'),
      ),
      body: QuestionCreatorForm(_user, _bank, firestore),
    );
  }
}

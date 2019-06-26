import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/tests/test_creator_form.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TestCreator extends StatelessWidget {
  final User _user;
  final List<DocumentSnapshot> _banks;
  final Firestore _firestore;

  TestCreator(this._user, this._banks, this._firestore);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Test Creator'),
      ),
      body: TestCreatorForm(_user, _banks, _firestore),
    );
  }
}

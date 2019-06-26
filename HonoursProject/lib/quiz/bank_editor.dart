import 'package:flutter/material.dart';

import '../user/user.dart';
import './question_creator.dart';
import './question_list.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class BankEditor extends StatelessWidget {
  final User _user;
  final DocumentReference _bank;
  final Firestore _firestore;

  BankEditor(this._user, this._bank, this._firestore);

  AlertDialog confirmNewQuestion(BuildContext context) {
    return AlertDialog(
      title: Text('Add Question'),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text('Would you like to add a new question to this bank?'),
          ],
        ),
      ),
      actions: <Widget>[
        Column(
          children: <Widget>[
            Text('Yes'),
            IconButton(
              icon: Icon(Icons.check),
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          QuestionCreator(_user, _bank, _firestore)),
                );
              },
            ),
          ],
        ),
        Column(
          children: <Widget>[
            Text('No'),
            IconButton(
              icon: Icon(Icons.clear),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Question List - \'' + _bank.documentID + '\''),
      ),
      body: QuestionList(_bank, _user, _firestore),
      floatingActionButton: FloatingActionButton(
        child: Icon(
          Icons.add,
          size: 32.0,
        ),
        onPressed: () => showDialog(
            context: context,
            builder: (BuildContext context) {
              return confirmNewQuestion(context);
            }),
      ),
    );
  }
}

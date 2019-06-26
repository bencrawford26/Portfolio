import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/tests/test_question_editor.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TestQuestionList extends StatelessWidget {
  final User _user;
  final DocumentReference _bank;
  final Firestore _firestore;

  TestQuestionList(this._user, this._bank, this._firestore);
  Widget buildList(DocumentSnapshot bankSnapshot) {
    return ListView.builder(
      itemCount: bankSnapshot['bank'].length,
      itemBuilder: (BuildContext context, int index) {
        return ExpansionTile(
          title: Text('Q:' +
              (index + 1).toString() +
              ' ' +
              bankSnapshot['bank'][index]['question']),
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                FlatButton(
                  child: Text(
                    'Edit',
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => TestQuestionEditor(
                              _user,
                              bankSnapshot['bank'][index],
                              index,
                              _bank,
                              _firestore)),
                    );
                  },
                ),
                FlatButton(
                  child: Text(
                    'Delete',
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  onPressed: () {
                    _user.deleteQuestion(
                        _bank, bankSnapshot['bank'][index], _firestore);
                  },
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: _bank.snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Text('Getting questions...');
          } else {
            return buildList(snapshot.data);
          }
        });
  }
}

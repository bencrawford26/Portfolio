import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/loading_page.dart';
import 'package:quiz_app/tests/test_editor.dart';
import 'package:quiz_app/tests/test_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TestTile extends StatelessWidget {
  final User _user;
  final Map _bank;
  final int _userBankNo;
  final Firestore _firestore;

  TestTile(this._user, this._bank, this._userBankNo, this._firestore);

  List<Map> setTotalQuestionStates(int total) {
    List<Map> b = [];

    for (int i = 0; i < total; i++) {
      b.add({'answered': false, 'correct': false});
    }

    return b;
  }

  void updateUserBanks(_bank) {
    for (int i = 0; i < _user.banks.length; i++) {
      if (_user.banks[i]['bankName'] == (_bank['name'])) {
        if (_user.banks[i]['questionStates'].length == _bank['bank'].length) {
          return;
        } else {
          DocumentReference user =
              _firestore.collection('users').document(_user.username);
          _firestore.runTransaction((Transaction tx) async {
            DocumentSnapshot postSnapshot = await tx.get(user);
            if (postSnapshot.exists) {
              print(postSnapshot.data['username']);
              print(_bank['total']);
              await tx.update(user, <String, dynamic>{
                'banks': FieldValue.arrayRemove(_bank),
              });
              await tx.update(user, <String, dynamic>{
                'banks': FieldValue.arrayUnion([
                  {
                    'bankName': _bank['name'],
                    'total': _bank['total'],
                    'questionStates': setTotalQuestionStates(_bank['total']),
                    'opened': true
                  }
                ]),
              });
            }
          });
        }
      }
    }
    DocumentReference user =
        _firestore.collection('users').document(_user.username);
    _firestore.runTransaction((Transaction tx) async {
      DocumentSnapshot postSnapshot = await tx.get(user);
      if (postSnapshot.exists) {
        print(postSnapshot.data['username']);
        print(_bank['total']);
        await tx.update(user, <String, dynamic>{
          'banks': FieldValue.arrayUnion([
            {
              'bankName': _bank['name'],
              'total': _bank['total'],
              'questionStates': setTotalQuestionStates(_bank['total']),
              'opened': true
            }
          ]),
        });
      }
    });
  }

  Widget getUserFromDB() {
    User newU;
    return StreamBuilder(
      stream:
          _firestore.collection('users').document(_user.username).snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return LoadingPage(titleText: 'Updating user...');
        } else if (snapshot.hasData) {
          newU = User(
              username: snapshot.data['username'],
              password: snapshot.data['password'],
              course: snapshot.data['course'],
              correctAnswers: snapshot.data['correctAnswers'],
              incorrectAnswers: snapshot.data['incorrectAnswers'],
              banks: snapshot.data['banks'],
              createdBanks: snapshot.data['createdBanks'],
              pupils: snapshot.data['pupils'],
              tutors: snapshot.data['tutors'],
              pupilRequests: snapshot.data['pupilRequests'],
              tutorRequests: snapshot.data['tutorRequests'],
              messages: snapshot.data['messages'],
              totalQuizTime: snapshot.data['totalQuizTime']);

          return TestPage(_bank, newU, _userBankNo, _firestore);
        }
      },
    );
  }

  Function _checkTakeQuizButton(BuildContext context) {
    if (_bank.isEmpty) {
      return null;
    } else {
      return () {
        //printAnswered();
        updateUserBanks(_bank);
        //getUserFromDB();
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => getUserFromDB()),
        );
      };
    }
  }

  Function _checkEditButton(BuildContext context) {
    print(_bank['creator']);
    if (_bank['creator'] != _user.username) {
      return null;
    } else {
      return () {
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => TestEditor(
                  _user,
                  _firestore.collection('tests').document(_bank['name']),
                  _firestore)),
        );
      };
    }
  }

  AlertDialog displayBankOptions(BuildContext context) {
    return AlertDialog(
      title: Text('Test Options'),
      content:
          Text('What would you like to do with the selected test?'),
      actions: <Widget>[
        FlatButton(
          child: Text('Take Test!'),
          onPressed: _checkTakeQuizButton(context),
        ),
        FlatButton(
          child: Text('Edit Test'),
          onPressed: _checkEditButton(context),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return RaisedButton(
      child: Text(_bank['name']),
      color: Colors.white,
      elevation: 3.0,
      highlightColor: Theme.of(context).primaryColor,
      onPressed: () => showDialog(
          context: context,
          builder: (BuildContext context) {
            return displayBankOptions(context);
          }),
    );
  }
}

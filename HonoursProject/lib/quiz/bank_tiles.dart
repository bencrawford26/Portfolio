import 'package:flutter/material.dart';

import '../user/user.dart';
import './quiz_page.dart';
import './bank_editor.dart';
import 'package:quiz_app/loading_page.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class BankTiles extends StatefulWidget {
  final Map _bank;
  final User _user;
  final int userBankNo;
  final Firestore firestore;

  BankTiles(this._bank, this._user, this.userBankNo, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return BankTilesState();
  }
}

class BankTilesState extends State<BankTiles> {
  User newU;
  void updateUserBanks(_bank) {
    for (int i = 0; i < widget._user.banks.length; i++) {
      if (widget._user.banks[i]['bankName'] == (_bank['name'])) {
        return;
      }
    }
    DocumentReference user =
        widget.firestore.collection('users').document(widget._user.username);
    widget.firestore.runTransaction((Transaction tx) async {
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
    return StreamBuilder(
        stream: widget.firestore
            .collection('users')
            .document(widget._user.username)
            .snapshots(),
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

            return QuizPage(
                widget._bank, newU, widget.userBankNo, widget.firestore);
          }
          print('Banks' + newU.banks.toString());
        });
  }

  List<Map> setTotalQuestionStates(int total) {
    List<Map> b = [];

    for (int i = 0; i < total; i++) {
      b.add({'answered': false, 'correct': false});
    }

    return b;
  }

  Map findBankFromUser() {
    for (int i = 0; i < widget._user.banks.length; i++) {
      if (widget._bank['name'] == widget._user.banks[i]['name']) {
        widget._user.banks[i]['bankState']['opened'] = true;
        return widget._user.banks[i];
      }
    }
    return null;
  }

  void printAnswered() {
    for (int i = 0; i < widget._bank['bankState']['total']; i++) {
      print(widget._bank[i]['questionState']['answered'].toString());
    }
  }

  Function _checkTakeQuizButton() {
    if (widget._bank.isEmpty) {
      return null;
    } else {
      return () {
        //printAnswered();
        updateUserBanks(widget._bank);
        //getUserFromDB();
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => getUserFromDB()),
        );
      };
    }
  }

  Function _checkEditButton() {
    print(widget._bank['creator']);
    if (widget._bank['creator'] != widget._user.username) {
      return null;
    } else {
      return () {
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => BankEditor(
                  widget._user,
                  widget.firestore
                      .collection('quizBanks')
                      .document(widget._bank['name']),
                  widget.firestore)),
        );
      };
    }
  }

  AlertDialog displayBankOptions(BuildContext context) {
    return AlertDialog(
      title: Text('Bank Options'),
      content:
          Text('What would you like to do with the selected question bank?'),
      actions: <Widget>[
        FlatButton(
          child: Text('Take Quiz!'),
          onPressed: _checkTakeQuizButton(),
        ),
        FlatButton(
          child: Text('Edit Quiz'),
          onPressed: _checkEditButton(),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return RaisedButton(
      child: Text(widget._bank['name']),
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

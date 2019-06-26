import 'package:flutter/material.dart';

import '../user/user.dart';

class TestFinalAnswerAlert extends StatelessWidget {
  final String _correct;
  final String _incorrect;
  final List<bool> bank;
  final Duration _quizTime;
  final User _user;

  TestFinalAnswerAlert(
      this._correct, this._incorrect, this.bank, this._quizTime, this._user);

  List<Widget> getChildren() {
    List<Widget> children = [];
    children.add(Text(_correct));
    children.add(Text(_incorrect));
    children.add(Text('Time Elapsed: ' +
        (_quizTime.inMinutes % 60).toString() +
        ' Minutes ' +
        (_quizTime.inSeconds % 60).toString() +
        ' Seconds'));
    for (var i = 0; i < bank.length; i++) {
      String correctAnswer = "";
      if(bank[i]) {
        correctAnswer = "Correct";
      } else {
        correctAnswer = "Incorrect";
      }
      children
          .add(Text("Q" + i.toString() + " " + correctAnswer));
    }
    return children;
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Test complete!'),
      content: SingleChildScrollView(
        child: ListBody(
          children: getChildren(),
        ),
      ),
      actions: <Widget>[
        FlatButton(
          child: Text('Back to menu'),
          color: Colors.white70,
          onPressed: () {
            Navigator.pop(context);
            Navigator.pop(context);
            _user.totalQuizTime['microSeconds'] += _quizTime.inMicroseconds;
            _user.totalQuizTime['milliSeconds'] += _quizTime.inMilliseconds;
            _user.totalQuizTime['seconds'] += _quizTime.inSeconds;
            _user.totalQuizTime['hours'] += _quizTime.inHours;
            //_user.totalQuizTime['days'] += _quizTime.inDays;
          },
        ),
      ],
    );
  }
}

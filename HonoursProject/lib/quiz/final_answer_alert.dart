import 'package:flutter/material.dart';

import '../user/user.dart';

class FinalAnswerAlert extends StatelessWidget {
  final String _answerStatus;
  final String _explanation;
  final String _correct;
  final String _incorrect;
  final Duration _quizTime;
  final User _user;

  FinalAnswerAlert(this._answerStatus, this._explanation, this._correct,
      this._incorrect, this._quizTime, this._user);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Quiz complete!'),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(
              'Final answer: ' + _answerStatus,
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(_explanation + "\n"),
            Text(_correct),
            Text(_incorrect),
            Text('Time Elapsed: ' +
                (_quizTime.inMinutes % 60).toString() +
                ' Minutes ' +
                (_quizTime.inSeconds % 60).toString() +
                ' Seconds'),
          ],
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

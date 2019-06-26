import 'package:flutter/material.dart';

import '../quiz/question_card.dart';
import '../quiz/answer_btn.dart';
import './test_final_answer_alert.dart';
import '../user/user.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TestPage extends StatefulWidget {
  final QuestionCard question = QuestionCard('Question');
  final Map _questions;
  final User _user;
  final int _userBankNo;
  final Firestore firestore;

  TestPage(this._questions, this._user, this._userBankNo, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return TestPageState();
  }
}

class TestPageState extends State<TestPage> {
  int _qNo = 0;
  int _correctAnswers = 0;
  int _incorrectAnswers = 0;
  List<bool> _answers = [];
  Stopwatch _timer = Stopwatch();

  void _nextQuestion(bool c) {
    widget._user.setAnswered(
        widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);

    if (_qNo == widget._questions['total'] - 1) {
      setState(() {
        _timer.stop();
        showFinalAnswer(c);
      });
    } else {
      setState(() {
        showSubmitAnswer(c);
        print('[$_qNo ANSWERED]');
        print('[$_correctAnswers CORRECT]');
        print('[$_incorrectAnswers INCORRECT]');
      });
    }
    widget._user
        .updateAllUserData(widget.firestore.collection('users'), widget._user);
  }

  void showSubmitAnswer(bool c) {
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text('Submit Answer?'),
            content: SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'You will be unable to change your answer until the next time you take this test.',
                  style: TextStyle(
                    fontSize: 16.0,
                  ),
                ),
              ),
            ),
            actions: <Widget>[
              FlatButton(
                child: Text('Yes'),
                color: Colors.white70,
                onPressed: () {
                  setState(() {
                    _qNo++;
                    bool _correct = c;
                    if (_correct) {
                      _correctAnswers++;
                      _answers.add(true);
                      if (widget._user.checkMaxQs())
                        widget._user.setCorrect(widget._user
                            .banks[widget._userBankNo]['questionStates'][_qNo]);
                    } else {
                      _incorrectAnswers++;
                      _answers.add(false);
                      widget._user.increaseIncorrectAnswers();
                    }
                    Navigator.pop(context);
                  });
                },
              ),
              FlatButton(
                child: Text('No'),
                color: Colors.white70,
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
            ],
          );
        });
  }

  void showFinalAnswer(bool c) {
    bool _correct = c;

    widget._user.setAnswered(
        widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);

    if (_correct) {
      if (!checkBankEnd()) {
        _correctAnswers++;
        _answers.add(true);
      }
      if (widget._user.checkMaxQs()) {
        print(widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);
        widget._user.setCorrect(
            widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);
        print(widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);
      }
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return TestFinalAnswerAlert(
              'Correct Answers: $_correctAnswers',
              '\nIncorrect Answers: $_incorrectAnswers',
              _answers,
              _timer.elapsed,
              widget._user,
            );
          });
    } else {
      if (!checkBankEnd()) {
        _incorrectAnswers++;
        _answers.add(false);
        widget._user.increaseIncorrectAnswers();
      }
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return TestFinalAnswerAlert(
              'Correct Answers: $_correctAnswers',
              '\nIncorrect Answers: $_incorrectAnswers',
              _answers,
              _timer.elapsed,
              widget._user,
            );
          });
    }
  }

  bool checkBankEnd() {
    if ((_qNo + 1) == (_incorrectAnswers + _correctAnswers)) {
      return true;
    } else {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final double cardHeight = MediaQuery.of(context).size.height - 330;
    List<dynamic> _bank = widget._questions['bank'];

    _timer.start();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget._questions['name']),
      ),
      body: Column(
        children: <Widget>[
          Container(
            height: cardHeight,
            child: QuestionCard(_bank[_qNo]['question'].toString()),
          ),
          Column(
            children: List.generate(
              _bank[_qNo]['answers'].length,
              (index) {
                return AnswerBtn(
                  _bank[_qNo]['answers'][index]['answer'],
                  _bank[_qNo]['answers'][index]['correct'],
                  _nextQuestion,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

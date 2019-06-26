import 'package:flutter/material.dart';

import './question_card.dart';
import './answer_btn.dart';
import './answer_alert.dart';
import './final_answer_alert.dart';
import '../user/user.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class QuizPage extends StatefulWidget {
  final QuestionCard question = QuestionCard('Question');
  final Map _questions;
  final User _user;
  final int _userBankNo;
  final Firestore firestore;

  QuizPage(this._questions, this._user, this._userBankNo, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return _QuizPageState();
  }
}

class _QuizPageState extends State<QuizPage> {
  int _qNo = 0;
  int _correctAnswers = 0;
  int _incorrectAnswers = 0;
  Stopwatch _timer = Stopwatch();

  void _nextQuestion(bool c) {
    print("_nextQuestion Called!");
    widget._user.setAnswered(
        widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);

    if (_qNo == widget._questions['total'] - 1) {
      setState(() {
        _timer.stop();
        showFinalAnswer(c);
      });
    } else {
      setState(() {
        print("_qNo: " + _qNo.toString() + " | total: " + widget._questions['total'].toString());
        showAnswers(c);
        _qNo++;
        print('[$_qNo ANSWERED]');
        print('[$_correctAnswers CORRECT]');
        print('[$_incorrectAnswers INCORRECT]');
      });
    }
    widget._user
        .updateAllUserData(widget.firestore.collection('users'), widget._user);
  }

  void showAnswers(bool c) {
    bool _correct = c;
    if (_correct) {
      _correctAnswers++;
      if (widget._user.checkMaxQs())
        widget._user.setCorrect(
            widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return AnswerAlert('Correct!',
                widget._questions['bank'][_qNo-1]['explanation']);
          });
    } else {
      _incorrectAnswers++;
      widget._user.increaseIncorrectAnswers();
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return AnswerAlert('Incorrect!',
                widget._questions['bank'][_qNo-1]['explanation']);
          });
    }
  }

  void showFinalAnswer(bool c) {
    bool _correct = c;

    widget._user.setAnswered(
        widget._user.banks[widget._userBankNo]['questionStates'][_qNo]);

    if (_correct) {
      if (!checkBankEnd()) {
        _correctAnswers++;
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
            return FinalAnswerAlert(
              'Correct!',
              widget._questions['bank'][_qNo]['explanation'],
              'Correct Answers: $_correctAnswers',
              '\nIncorrect Answers: $_incorrectAnswers',
              _timer.elapsed,
              widget._user,
            );
          });
    } else {
      if (!checkBankEnd()) {
        _incorrectAnswers++;
        widget._user.increaseIncorrectAnswers();
      }
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return FinalAnswerAlert(
              'Incorrect',
              widget._questions['bank'][_qNo]['explanation'],
              'Correct Answers: $_correctAnswers',
              '\nIncorrect Answers: $_incorrectAnswers',
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

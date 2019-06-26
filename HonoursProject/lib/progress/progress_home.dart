import 'package:flutter/material.dart';

import '../user/user_nav_drawer.dart';
import '../user/user.dart';
import './progress_tile.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class ProgressHome extends StatelessWidget {
  final User _user;
  final User _userBeingReviewed;
  final Firestore firestore;

  ProgressHome(this._user, this._userBeingReviewed, this.firestore);

  @override
  Widget build(BuildContext context) {
    print(_userBeingReviewed.username);
    int _attempts = _userBeingReviewed.getAttemptedAnswers();
    int _correct = _userBeingReviewed.getCorrectAnswers();
    int _incorrect = _userBeingReviewed.incorrectAnswers;
    int _tutors = _userBeingReviewed.tutors.length;
    int _pupils = _userBeingReviewed.pupils.length;

    String _quizSeconds =
        (_userBeingReviewed.totalQuizTime['seconds'] % 60).toString();
    String _quizMinutes =
        (_userBeingReviewed.totalQuizTime['minutes'] % 60).toString();
    String _quizHours =
        (_userBeingReviewed.totalQuizTime['hours'] % 24).toString();
    String _quizDays = _userBeingReviewed.totalQuizTime['days'].toString();
    String _quizTime = ('''$_quizDays Days, $_quizHours Hours
$_quizMinutes Minutes, $_quizSeconds Seconds.''');

    int _totalQs = _userBeingReviewed.getTotalQuestions();
    int _totalBanks = _userBeingReviewed.banks.length;

    int getBanksOpened() {
      int opened = 0;
      for (int i = 0;
          i < _userBeingReviewed.banks.length;
          i++) {
        if (_userBeingReviewed.banks[i]['opened'])
          opened++;
      }
      return opened;
    }

    int _banksOpened = getBanksOpened();

    return Scaffold(
      appBar: AppBar(
        title: Text(_userBeingReviewed.username + '\'s Progress'),
      ),
      body: ListView(
        children: <Widget>[
          Column(
            children: <Widget>[
              ProgressTile(
                title: 'Attempted Questions',
                current: _attempts,
                total: _totalQs,
              ),
              ProgressTile(
                title: 'Correct Answers',
                current: _correct,
                total: _totalQs,
              ),
              ProgressTile(
                title: 'Incorrect Answers',
                current: _incorrect,
              ),
              ProgressTile(
                title: 'Time Spent in Quizzes',
                current: _quizTime,
              ),
              ProgressTile(
                title: 'Question Banks Opened',
                current: _banksOpened,
                total: _totalBanks,
              ),
              ProgressTile(
                title: 'Pupils',
                current: _pupils,
              ),
              ProgressTile(
                title: 'Tutors',
                current: _tutors,
              ),
            ],
          ),
        ],
      ),
      drawer: UserNavDrawer(_user, firestore),
    );
  }
}

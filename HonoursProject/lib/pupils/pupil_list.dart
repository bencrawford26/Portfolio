import 'package:flutter/material.dart';

import '../user/user.dart';
import '../progress/progress_home.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class PupilList extends StatelessWidget {
  final User _user;
  final List<DocumentSnapshot> pupilList;
  final Firestore firestore;

  PupilList(this._user, this.pupilList, this.firestore);

  User getUserFromDB(DocumentSnapshot _u) {
    User user = User(
        username: _u['username'],
        password: _u['password'],
        correctAnswers: _u['correctAnswers'],
        incorrectAnswers: _u['incorrectAnswers'],
        banks: _u['banks'],
        createdBanks: _u['createdBanks'],
        pupils: _u['pupils'],
        tutors: _u['tutors'],
        pupilRequests: _u['pupilRequests'],
        tutorRequests: _u['tutorRequests'],
        messages: _u['messages'],
        totalQuizTime: _u['totalQuizTime']);

    return user;
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
        stream: firestore
            .collection('users')
            .where('tutors', arrayContains: _user.username)
            .snapshots(),
        builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
          if (!snapshot.hasData) return const Text('Loading...');
          final int userCount = snapshot.data.documents.length;
          return ListView.builder(
            itemCount: userCount,
            itemBuilder: (BuildContext context, int index) {
              final _p = getUserFromDB(snapshot.data.documents[index]);
              int _correct = _p.getCorrectAnswers();
              int _banksOpened = _p.getBanksOpened();
              int _totalQs = _p.getTotalQuestions();
              int _totalBanks = _p.banks.length;

              String _banks = '$_banksOpened/$_totalBanks';
              String _questionsCorrect = '$_correct/$_totalQs';
              return ExpansionTile(
                title: Text(_p.username),
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      FlatButton(
                        child: Text(
                          'View ' + _p.username + '\'s full progress',
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                          ),
                        ),
                        onPressed: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ProgressHome(_user, _p, firestore),
                              ),
                            ),
                      )
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      UserInfoCard('Banks', _banks),
                      UserInfoCard('Correct Answers', _questionsCorrect),
                    ],
                  ),
                ],
              );
            },
          );
        });
  }
}

class UserInfoCard extends StatelessWidget {
  final String _headingText;
  final String _subText;

  UserInfoCard(this._headingText, this._subText);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        padding: EdgeInsets.only(top: 8.0, bottom: 8.0),
        width: (MediaQuery.of(context).size.width / 2) - 10,
        child: Column(
          children: <Widget>[
            Text(_headingText),
            Text(_subText),
          ],
        ),
      ),
    );
  }
}

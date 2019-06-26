import 'package:flutter/material.dart';

import '../user/user.dart';
import './tutor_banks_home.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TutorList extends StatelessWidget {
  final User _user;
  final List<DocumentSnapshot> tutorList;
  final Firestore firestore;

  TutorList(this._user, this.tutorList, this.firestore);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: tutorList.length,
      itemBuilder: (BuildContext context, int index) {
        final _t = tutorList[index];
        return ExpansionTile(
          title: Text(_t['username']),
          children: <Widget>[
            FlatButton(
              child: Text(
                'View ' + _t['username'] + '\'s Quizzes',
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                ),
              ),
              onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          TutorBanksHome(_user, tutorList[index], firestore),
                    ),
                  ),
            ),
          ],
        );
      },
    );
  }
}

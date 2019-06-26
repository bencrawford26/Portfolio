import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/loading_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class BankProgress extends StatelessWidget {
  final User _user;
  final Firestore _firestore;

  BankProgress(this._user, this._firestore);

  List<Widget> getCourses(List<DocumentSnapshot> users) {
    List<Widget> tiles = [];
    List<String> courses = [];
    List<Map> courseDetails = [];
    for (var i = 0; i < users.length; i++) {
      if (!courses.contains(users[i]['course'].toLowerCase())) {
        Map course = {
          'course': users[i]['course'],
          'pupils': 1,
          'banks': [],
          'totalQuestions': 0,
          'totalCorrect': 0,
        };

        for (var j = 0; j < users[i]['banks'].length; j++) {}

        courseDetails.add(course);
        courses.add(users[i]['course'].toLowerCase());
      } else {
        for (var j = 0; j < courseDetails.length; j++) {
          if (courseDetails[j]['course'] == users[i]['course']) {
            courseDetails[j]['pupils']++;

            for (var k = 0; k < users[i]['banks'].length; k++) {}
          }
        }
      }
    }

    for (var i = 0; i < courseDetails.length; i++) {
      courseDetails[i].addAll({
        'correctPercentage': courseDetails[i]['totalCorrect'] /
            courseDetails[i]['totalQuestions'] *
            100
      });
    }

    for (var i = 0; i < users.length; i++) {
      tiles.add(
        ExpansionTile(
          title: Text(users[i]['username']),
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[],
            ),
          ],
        ),
      );
    }
    return tiles;
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: _firestore
            .collection('users')
            .where('tutors', arrayContains: _user.username)
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return LoadingPage(titleText: 'Getting pupils...');
          } else {
            if (snapshot.data.documents.length == 0) {
              return Text('No pupils to show progress for');
            } else {
              return ListView(
                children: getCourses(snapshot.data.documents),
              );
            }
          }
        });
  }
}

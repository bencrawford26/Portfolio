import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/loading_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class CourseProgress extends StatelessWidget {
  final User user;
  final Firestore firestore;

  CourseProgress(this.user, this.firestore);

  List<Widget> getCourses(AsyncSnapshot<dynamic> users) {
    List<Widget> tiles = [];
    List<String> courses = [];
    List<Map> courseDetails = [];
    for (var i = 0; i < users.data.documents.length; i++) {
      if (!courses.contains(users.data.documents[i]['course'].toLowerCase())) {
        Map course = {
          'course': users.data.documents[i]['course'],
          'pupils': 1,
          'banks': [],
          'totalQuestions': 0,
          'totalCorrect': 0,
        };

        for (var j = 0; j < users.data.documents[i]['banks'].length; j++) {
          addTotalQuestions(users.data.documents[i], j, course);
        }

        courseDetails.add(course);
        courses.add(users.data.documents[i]['course'].toLowerCase());
      } else {
        for (var j = 0; j < courseDetails.length; j++) {
          if (courseDetails[j]['course'] == users.data.documents[i]['course']) {
            courseDetails[j]['pupils']++;

            for (var k = 0; k < users.data.documents[i]['banks'].length; k++) {
              addTotalQuestionsForExistingCourse(
                  users.data.documents[i], k, courseDetails[j]);
            }
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

    for (var i = 0; i < courses.length; i++) {
      tiles.add(
        ExpansionTile(
          title: Text(users.data.documents[i]['course']),
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                displayPupils(courseDetails[i]['pupils']),
                displayQuizzes(courseDetails[i]['banks']),
                displayPercentage(courseDetails[i]['correctPercentage']),
              ],
            ),
          ],
        ),
      );
    }
    return tiles;
  }

  void addTotalQuestions(
      DocumentSnapshot currentUser, int bankNo, Map currentCourse) {
    if (user.createdBanks.contains(currentUser['banks'][bankNo]['bankName'])) {
      currentCourse['totalQuestions'] += currentUser['banks'][bankNo]['total'];
      currentCourse['banks'].add(currentUser['banks'][bankNo]);

      for (var k = 0;
          k < currentUser['banks'][bankNo]['questionStates'].length;
          k++) {
        if (currentUser['banks'][bankNo]['questionStates'][k]['correct'] ==
            true) {
          currentCourse['totalCorrect']++;
        }
      }
    }
  }

  addTotalQuestionsForExistingCourse(
      DocumentSnapshot currentUser, int bankNo, Map currentCourse) {
    if (user.createdBanks.contains(currentUser['banks'][bankNo]['bankName'])) {
      currentCourse['totalQuestions'] += currentUser['banks'][bankNo]['total'];

      for (var l = 0;
          l < currentUser['banks'][bankNo]['questionStates'].length;
          l++) {
        if (currentUser['banks'][bankNo]['questionStates'][l]['correct'] ==
            true) {
          currentCourse['totalCorrect']++;
        }
      }
    }
  }

  Widget displayPupils(int pupils) {
    return Padding(
      padding: EdgeInsets.only(top: 15),
      child: Column(
        children: <Widget>[
          Text('Pupils'),
          Padding(
            padding: EdgeInsetsDirectional.only(top: 15, bottom: 15),
            child: Text(pupils.toString()),
          ),
        ],
      ),
    );
  }

  Widget displayQuizzes(List banks) {
    return Padding(
      padding: EdgeInsets.only(top: 15),
      child: Column(
        children: <Widget>[
          Text('Banks'),
          Padding(
            padding: EdgeInsetsDirectional.only(top: 15, bottom: 15),
            child: Text(banks.length.toString()),
          ),
        ],
      ),
    );
  }

  Widget displayPercentage(double percentage) {
    if (percentage.isNaN) {
      percentage = 0;
    }
    return Padding(
      padding: EdgeInsets.only(top: 15),
      child: Column(
        children: <Widget>[
          Text('Correct'),
          Padding(
            padding: EdgeInsetsDirectional.only(top: 15, bottom: 15),
            child: Text(percentage.round().toString() + '%'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: firestore
            .collection('users')
            .where('tutors', arrayContains: user.username)
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return LoadingPage(titleText: 'Getting pupils...');
          } else {
            if (snapshot.data.documents.length == 0) {
              return Text('No pupils to show progress for');
            } else {
              return ListView(
                children: getCourses(snapshot),
              );
            }
          }
        });
  }
}

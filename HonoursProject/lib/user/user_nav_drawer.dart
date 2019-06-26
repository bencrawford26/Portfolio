import 'package:flutter/material.dart';

import './user_home.dart';
import './user.dart';
import '../quiz/question_bank_home.dart';
import '../tests/test_home.dart';
import '../tutors/tutor_home.dart';
import '../pupils/pupil_home.dart';
import '../progress/progress_home.dart';
import '../messages/messages_home.dart';
import '../progress/course_progress_home.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class UserNavDrawer extends StatelessWidget {
  final User _user;
  final Firestore firestore;

  UserNavDrawer(this._user, this.firestore);

  IconData pupilRequestAlert(List<dynamic> requests) {
    if (requests.isNotEmpty) {
      return Icons.warning;
    } else {
      return null;
    }
  }

  IconData tutorRequestAlert(List<dynamic> requests) {
    if (requests.isNotEmpty) {
      return Icons.warning;
    } else {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream:
            firestore.collection('users').document(_user.username).snapshots(),
        builder: (BuildContext context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Drawer(child: Text('loading...'));
          } else {
            User updatedUser = _user.getUserFromDB(snapshot.data);
            return Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  UserDrawerHeader(updatedUser),
                  UserDrawerButton(
                    icon: Icons.home,
                    text: 'Home',
                    newPage: UserHome(updatedUser, firestore),
                  ),
                  UserDrawerButton(
                    icon: Icons.archive,
                    text: 'Quiz Banks',
                    newPage: QuestionBankHome(updatedUser, firestore),
                  ),
                  UserDrawerButton(
                    icon: Icons.assignment_turned_in,
                    text: "Tests",
                    newPage: TestHome(updatedUser, firestore),
                  ),
                  UserDrawerButton(
                    icon: Icons.assistant,
                    text: 'My Tutors',
                    newPage: TutorHome(updatedUser, firestore),
                    alert: tutorRequestAlert(snapshot.data['tutorRequests']),
                  ),
                  UserDrawerButton(
                    icon: Icons.assignment,
                    text: 'My Pupils',
                    newPage: PupilHome(updatedUser, firestore),
                    alert: pupilRequestAlert(snapshot.data['pupilRequests']),
                  ),
                  UserDrawerButton(
                    icon: Icons.message,
                    text: 'Messages',
                    newPage: MessagesHome(updatedUser, firestore),
                  ),
                  UserDrawerButton(
                    icon: Icons.assessment,
                    text: 'Progress',
                    newPage: ProgressHome(updatedUser, updatedUser, firestore),
                  ),
                  UserDrawerButton(
                      icon: Icons.dns,
                      text: 'Course Progress',
                      newPage: CourseProgressHome(updatedUser, firestore)),
                  ListTile(
                    leading: Icon(Icons.power),
                    title: Text('Logout'),
                    onTap: () {
                      Navigator.popUntil(context, ModalRoute.withName('/'));
                    },
                  ),
                ],
              ),
            );
          }
        });
  }
}

class UserDrawerHeader extends StatelessWidget {
  final User _u;

  UserDrawerHeader(this._u);

  @override
  Widget build(BuildContext context) {
    return DrawerHeader(
      padding: EdgeInsets.zero,
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor,
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Theme.of(context).primaryColor,
            Theme.of(context).accentColor
          ],
        ),
      ),
      child: Padding(
        padding: EdgeInsets.only(top: 32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            Icon(
              Icons.people,
              color: Colors.white,
              size: 30.0,
            ),
            Text(
              _u.username,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 20.0,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class UserDrawerButton extends StatelessWidget {
  final IconData icon;
  final String text;
  final Widget newPage;
  final IconData alert;

  UserDrawerButton({this.icon, this.text, this.newPage, this.alert});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon),
      title: Text(text),
      trailing: Icon(
        alert,
        color: Colors.redAccent,
      ),
      onTap: () {
        Navigator.pop(context);
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => newPage),
        );
      },
    );
  }
}

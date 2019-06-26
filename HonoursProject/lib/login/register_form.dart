import 'package:flutter/material.dart';

import '../user/user_home.dart';
import '../user/user.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class RegisterForm extends StatefulWidget {
  RegisterForm({this.firestore});
  final Firestore firestore;
  @override
  RegisterFormState createState() {
    return RegisterFormState();
  }
}

class RegisterFormState extends State<RegisterForm> {
  final _formKey = GlobalKey<FormState>();

  String _username;
  String _password;
  String _course;

  Future<void> _addUser(String uname, String pw, String course) async {
    User u = User(
        username: uname,
        password: pw,
        course: course,
        correctAnswers: 0,
        incorrectAnswers: 0,
        banks: [],
        createdBanks: [],
        pupils: [],
        tutors: [],
        pupilRequests: [],
        tutorRequests: [],
        messages: {
          'inbox': [],
          'sentMessages': []
        },
        totalQuizTime: {
          'microSeconds': 0,
          'milliSeconds': 0,
          'seconds': 0,
          'minutes': 0,
          'hours': 0,
          'days': 0
        });
    print('user created, adding to database...');
    await widget.firestore
        .collection('users')
        .document(u.username)
        .setData(<String, dynamic>{
      'username': u.username,
      'password': u.password,
      'course': u.course,
      'correctAnswers': u.correctAnswers,
      'incorrectAnswers': u.incorrectAnswers,
      'banks': u.banks,
      'createdBanks': u.createdBanks,
      'pupils': u.pupils,
      'tutors': u.tutors,
      'pupilRequests': u.pupilRequests,
      'tutorRequests': u.tutorRequests,
      'messages': u.messages,
      'totalQuizTime': u.totalQuizTime
    });
    DocumentReference doc = widget.firestore
        .collection('quizBanks')
        .document('kMs26Lr5MOMF5m8Hn3a4');
    widget.firestore.runTransaction((Transaction tx) async {
      DocumentSnapshot postSnapshot = await tx.get(doc);
      if (postSnapshot.exists) {
        await tx.update(doc, <String, dynamic>{
          'participants': FieldValue.arrayUnion([u.username])
        });
      }
    });
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => UserHome(u, widget.firestore)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: <Widget>[
          TextFormField(
            decoration: InputDecoration(
              hintText: 'Username',
              suffixIcon: Icon(
                Icons.verified_user,
                size: 18.0,
              ),
            ),
            // The validator receives the text the user has typed in
            validator: (value) {
              if (value.isEmpty) {
                return 'Please enter a username';
              }
              _username = value;
            },
          ),
          TextFormField(
            decoration: InputDecoration(
              hintText: 'Course',
              suffixIcon: Icon(
                Icons.assignment,
                size: 18.0,
              ),
            ),
            // The validator receives the text the user has typed in
            validator: (value) {
              if (value.isEmpty) {
                return 'Please enter a course';
              }
              _course = value;
            },
          ),
          TextFormField(
            obscureText: true,
            decoration: InputDecoration(
              hintText: 'Password',
              suffixIcon: Icon(
                Icons.lock,
                size: 18.0,
              ),
            ),
            validator: (value) {
              if (value.isEmpty) {
                return 'Please enter a password';
              }
              _password = value;
            },
          ),
          TextFormField(
            obscureText: true,
            decoration: InputDecoration(
              hintText: 'Confirm Password',
              suffixIcon: Icon(
                Icons.lock,
                size: 18.0,
              ),
            ),
            validator: (value) {
              if (value.isEmpty) {
                return 'Please confirm your password';
              }
              if (value != _password) {
                return 'Passwords don\'t match';
              }
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: RaisedButton(
              onPressed: () {
                // Validate will return true if the form is valid, or false if
                // the form is invalid.
                if (_formKey.currentState.validate()) {
                  Scaffold.of(context)
                      .showSnackBar(SnackBar(content: Text('Processing Data')));
                  _addUser(_username, _password, _course);
                }
              },
              child: Text('Register'),
            ),
          )
        ],
      ),
    );
  }
}

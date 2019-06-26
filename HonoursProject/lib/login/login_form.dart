import 'package:flutter/material.dart';

import '../user/user_home.dart';
import '../user/user.dart';
import '../loading_page.dart';
import 'login_fail_dialog.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class LoginForm extends StatefulWidget {
  LoginForm({this.firestore});
  final Firestore firestore;
  @override
  LoginFormState createState() {
    return LoginFormState();
  }

  User getUserFromDB(DocumentSnapshot _u) {
    User user = User(
        username: _u['username'],
        password: _u['password'],
        course: _u['course'],
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

  Widget getUser(u, p, Firestore f) {
    User _user;
    return new StreamBuilder(
        stream: f
            .collection('users')
            .where('username', isEqualTo: u)
            .where('password', isEqualTo: p)
            .snapshots(),
        builder: (BuildContext context, snapshot) {
          if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingPage(titleText: "Logging in...");
          } else {
            if (snapshot.hasData) {
              if (snapshot.data.documents.length == 0) {
                return LoginFailDialog(
                    titleText: "Logging in...", firestore: f);
              } else {
                DocumentSnapshot u = snapshot.data.documents[0];
                _user = getUserFromDB(u);
                return UserHome(_user, firestore);
              }
            }
          }
        });
  }
}

class LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();

  String _uname;
  String _pass;

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
              _uname = value;
              //return 'Invalid Username';
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
              _pass = value;
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
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            widget.getUser(_uname, _pass, widget.firestore),
                      ));
                }
              },
              child: Text('Login'),
            ),
          )
        ],
      ),
    );
  }
}

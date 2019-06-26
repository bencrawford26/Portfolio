import 'package:flutter/material.dart';

import 'login_page.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class LoginFailDialog extends StatelessWidget {
  LoginFailDialog({this.titleText, this.firestore});
  final Firestore firestore;
  final String titleText;

  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Text(titleText),
        ),
        body: AlertDialog(
          title: Text('Login failed!'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Incorrect username or password. Please try again.'),
                Text('If you don\'t have an account the please register.'),
              ],
            ),
          ),
          actions: <Widget>[
            FlatButton(
              child: Text('Retry'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            FlatButton(
              child: Text('Register'),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          LoginPage(false, firestore: firestore),
                    ));
              },
            ),
          ],
        ));
  }
}

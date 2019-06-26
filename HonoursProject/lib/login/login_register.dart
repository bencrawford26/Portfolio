import 'package:flutter/material.dart';

import './login_page.dart';
//import '../user/user.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class LoginRegister extends StatelessWidget {
  LoginRegister({this.firestore});
  final Firestore firestore;

  @override
  Widget build(BuildContext context) {
    return Flex(
      direction: Axis.vertical,
      children: <Widget>[
        Expanded(
          child: Card(
            child: Container(
              padding: EdgeInsets.fromLTRB(48.0, 40.0, 48.0, 0.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Container(
                        margin: EdgeInsets.only(bottom: 24.0),
                        child: Icon(
                          Icons.supervised_user_circle,
                          color: Theme.of(context).primaryColor,
                          size: 50.0,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      RaisedButton(
                        child: Text('Login'),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => LoginPage(true, firestore: firestore)),
                          );
                        },
                      ),
                      RaisedButton(
                        child: Text('Register'),
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => LoginPage(false, firestore: firestore)),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

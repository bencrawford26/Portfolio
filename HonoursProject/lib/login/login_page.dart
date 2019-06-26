import 'package:flutter/material.dart';

import './login_form.dart';
import './register_form.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class LoginPage extends StatelessWidget {
  LoginPage(this._returning, {this.firestore});
  final bool _returning;
  final Firestore firestore;

  Widget setFormType() {
    if (_returning) {
      return LoginForm(firestore: firestore,);
    } else {
      return RegisterForm(firestore: firestore,);
    }
  }

  String setAppbarText() {
    if (_returning) {
      return 'Returning User';
    } else {
      return 'New User';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text(
          setAppbarText(),
          textAlign: TextAlign.center,
        ),
      ),
      body: Flex(
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
                    setFormType(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

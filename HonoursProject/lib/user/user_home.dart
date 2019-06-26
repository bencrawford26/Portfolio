import 'package:flutter/material.dart';

import './user_nav_drawer.dart';
import './user.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class UserHome extends StatelessWidget {
  final User _user;
  final Firestore firestore;

  UserHome(this._user, this.firestore);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_user.username + '\'s Home'),
      ),
      body: Center(
        child: Text('Welcome, ' + _user.username + '!\n'),
      ),
      drawer: UserNavDrawer(_user, firestore),
    );
  }
}

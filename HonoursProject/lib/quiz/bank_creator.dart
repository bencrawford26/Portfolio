import 'package:flutter/material.dart';

import '../user/user.dart';
import './bank_creator_form.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class BankCreator extends StatelessWidget {
  final User _user;
  final List<DocumentSnapshot> banks;
  final Firestore firestore;

  BankCreator(this._user, this.banks, this.firestore);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bank Creator'),
      ),
      body: BankCreatorForm(_user, banks, firestore),
    );
  }
}

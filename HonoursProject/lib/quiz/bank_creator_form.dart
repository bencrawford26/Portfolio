import 'package:flutter/material.dart';

import '../user/user.dart';
import '../instruction_text.dart';
import './bank_editor.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class BankCreatorForm extends StatefulWidget {
  final User _user;
  final List<DocumentSnapshot> allBanks;
  final Firestore firestore;

  BankCreatorForm(this._user, this.allBanks, this.firestore);

  @override
  BankCreatorFormState createState() {
    return BankCreatorFormState();
  }
}

class BankCreatorFormState extends State<BankCreatorForm> {
  final _formKey = GlobalKey<FormState>();

  String _bankName;
  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: <Widget>[
          InstructionText('Please enter the name of your new question bank: '),
          Container(
            margin: EdgeInsets.all(16.0),
            child: TextFormField(
              decoration: InputDecoration(
                hintText: 'Bank name',
                suffixIcon: Icon(
                  Icons.dashboard,
                  size: 18.0,
                ),
              ),
              // The validator receives the text the user has typed in
              validator: (value) {
                if (value.isEmpty) {
                  return 'Please enter a name for your new bank';
                } else {
                  _bankName = value;
                  for (int i = 0; i < widget.allBanks.length; i++) {
                    if (_bankName == widget.allBanks[i]['name']) {
                      return 'This bank name already exists';
                    }
                  }
                }
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: FlatButton(
              onPressed: () {
                // Validate will return true if the form is valid, or false if
                // the form is invalid.
                if (_formKey.currentState.validate()) {
                  widget._user
                      .createBank(_bankName, widget._user, widget.firestore);
                  Scaffold.of(context)
                      .showSnackBar(SnackBar(content: Text('Processing Data')));
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => BankEditor(
                          widget._user,
                          widget._user.getBankByName(_bankName,
                              widget.firestore.collection('quizBanks')),
                          widget.firestore),
                    ),
                  );
                }
              },
              child: Text('Create Bank!'),
            ),
          )
        ],
      ),
    );
  }
}

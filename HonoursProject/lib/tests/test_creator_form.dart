import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/instruction_text.dart';
import 'package:quiz_app/tests/test_editor.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TestCreatorForm extends StatefulWidget {
  final User _user;
  final List<DocumentSnapshot> _banks;
  final Firestore _firestore;

  TestCreatorForm(this._user, this._banks, this._firestore);

  @override
  State<StatefulWidget> createState() {
    return TestCreatorFormState();
  }
}

class TestCreatorFormState extends State<TestCreatorForm> {
  final _formKey = GlobalKey<FormState>();

  String _testName;
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
                  _testName = value;
                  for (int i = 0; i < widget._banks.length; i++) {
                    if (_testName == widget._banks[i]['name']) {
                      return 'This test name already exists';
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
                      .createTest(_testName, widget._user, widget._firestore);
                  Scaffold.of(context)
                      .showSnackBar(SnackBar(content: Text('Processing Data')));
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => TestEditor(
                          widget._user,
                          widget._user.getBankByName(_testName,
                              widget._firestore.collection('tests')),
                          widget._firestore),
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

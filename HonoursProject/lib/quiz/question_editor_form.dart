import 'package:flutter/material.dart';

import '../user/user.dart';
import '../instruction_text.dart';
import './bank_editor.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class QuestionEditorForm extends StatefulWidget {
  final User _user;
  final Map _questionMap;
  final int _questionNo;
  final DocumentReference _bank;
  final Firestore firestore;

  QuestionEditorForm(this._user, this._questionMap, this._questionNo,
      this._bank, this.firestore);

  @override
  QuestionEditorFormState createState() {
    return QuestionEditorFormState();
  }
}

class QuestionEditorFormState extends State<QuestionEditorForm> {
  final _formKey = GlobalKey<FormState>();

  String _question;
  String _ans1;
  bool _a1Correct = false;
  String _ans2;
  bool _a2Correct = false;
  String _ans3;
  bool _a3Correct = false;
  String _ans4;
  bool _a4Correct = false;

  String _explanation;

  void processForm() {
    // Validate will return true if the form is valid, or false if
    // the form is invalid.
    if (_formKey.currentState.validate()) {
      setState(() {
        if (_a1Correct || _a2Correct || _a3Correct || _a4Correct) {
          widget._user.editQuizQuestion(
              _question,
              _ans1,
              _a1Correct,
              _ans2,
              _a2Correct,
              _ans3,
              _a3Correct,
              _ans4,
              _a4Correct,
              _explanation,
              widget._bank,
              widget._questionMap,
              widget._questionNo,
              widget.firestore);
          Navigator.pop(context);
          Scaffold.of(context)
              .showSnackBar(SnackBar(content: Text('Updating Question')));
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  BankEditor(widget._user, widget._bank, widget.firestore),
            ),
          );
        } else {
          Scaffold.of(context).showSnackBar(
              SnackBar(content: Text('One answer must be correct')));
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: ListView(
        children: <Widget>[
          InstructionText('Please enter the contents of your question:'),
          Container(
            margin: EdgeInsets.all(16.0),
            child: TextFormField(
              initialValue: widget._questionMap['question'],
              maxLines: null,
              decoration: InputDecoration(
                hintText: 'Question',
              ),
              // The validator receives the text the user has typed in
              validator: (value) {
                if (value.isEmpty) {
                  return 'Please enter a question';
                } else {
                  _question = value;
                }
              },
            ),
          ),
          Container(
            margin: EdgeInsets.all(16.0),
            child: TextFormField(
              maxLines: null,
              initialValue: widget._questionMap['answers'][0]['answer'],
              decoration: InputDecoration(
                hintText: 'Answer 1',
              ),
              validator: (value) {
                if (value.isEmpty) {
                  return 'Questions must have four possible answers';
                } else {
                  _ans1 = value;
                }
              },
            ),
          ),
          Container(
            margin: EdgeInsets.all(16.0),
            child: TextFormField(
              maxLines: null,
              initialValue: widget._questionMap['answers'][1]['answer'],
              decoration: InputDecoration(
                hintText: 'Answer 2',
              ),
              validator: (value) {
                if (value.isEmpty) {
                  return 'Questions must have four possible answers';
                } else {
                  _ans2 = value;
                }
              },
            ),
          ),
          Container(
            margin: EdgeInsets.all(16.0),
            child: TextFormField(
              maxLines: null,
              initialValue: widget._questionMap['answers'][2]['answer'],
              decoration: InputDecoration(
                hintText: 'Answer 3',
              ),
              validator: (value) {
                if (value.isEmpty) {
                  return 'Questions must have four possible answers';
                } else {
                  _ans3 = value;
                }
              },
            ),
          ),
          Container(
            margin: EdgeInsets.all(16.0),
            child: TextFormField(
              maxLines: null,
              initialValue: widget._questionMap['answers'][3]['answer'],
              decoration: InputDecoration(
                hintText: 'Answer 4',
              ),
              validator: (value) {
                if (value.isEmpty) {
                  return 'Questions must have four possible answers';
                } else {
                  _ans4 = value;
                }
              },
            ),
          ),
          InstructionText('Please select which answer is correct: '),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: <Widget>[
              Column(
                children: <Widget>[
                  Checkbox(
                    value: _a1Correct,
                    onChanged: (value) {
                      setState(() {
                        _a1Correct = value;
                      });
                    },
                  ),
                  Text('Answer 1')
                ],
              ),
              Column(
                children: <Widget>[
                  Checkbox(
                    value: _a2Correct,
                    onChanged: (value) {
                      setState(() {
                        _a2Correct = value;
                      });
                    },
                  ),
                  Text('Answer 2')
                ],
              ),
              Column(
                children: <Widget>[
                  Checkbox(
                    value: _a3Correct,
                    onChanged: (value) {
                      setState(() {
                        _a3Correct = value;
                      });
                    },
                  ),
                  Text('Answer 3')
                ],
              ),
              Column(
                children: <Widget>[
                  Checkbox(
                    value: _a4Correct,
                    onChanged: (value) {
                      setState(() {
                        _a4Correct = value;
                      });
                    },
                  ),
                  Text('Answer 4')
                ],
              ),
            ],
          ),
          Container(
            margin: EdgeInsets.only(left: 16.0, right: 16.0, top: 32.0),
            child: TextFormField(
              maxLines: null,
              decoration: InputDecoration(
                hintText: 'Explanation',
              ),
              validator: (value) {
                if (value.isEmpty) {
                  return 'Answers in quizzes must have an explanation';
                } else {
                  _explanation = value;
                }
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: FlatButton(
              onPressed: () => processForm(),
              child: Text('Create Question!'),
            ),
          )
        ],
      ),
    );
  }
}

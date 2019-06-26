import 'package:flutter/material.dart';

import '../user/user.dart';
import './question_editor.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class QuestionList extends StatefulWidget {
  final User _user;
  final DocumentReference _bank;
  final Firestore firestore;

  QuestionList(this._bank, this._user, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return QuestionListState();
  }
}

class QuestionListState extends State<QuestionList> {
  Widget buildList(DocumentSnapshot bankSnapshot) {
    return ListView.builder(
      itemCount: bankSnapshot['bank'].length,
      itemBuilder: (BuildContext context, int index) {
        return ExpansionTile(
          title: Text('Q:' +
              (index + 1).toString() +
              ' ' +
              bankSnapshot['bank'][index]['question']),
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                FlatButton(
                  child: Text(
                    'Edit',
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => QuestionEditor(
                              widget._user,
                              bankSnapshot['bank'][index],
                              index,
                              widget._bank,
                              widget.firestore)),
                    );
                  },
                ),
                FlatButton(
                  child: Text(
                    'Delete',
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  onPressed: () {
                    setState(() {
                      widget._user.deleteQuestion(
                          widget._bank, bankSnapshot['bank'][index], widget.firestore);
                    });
                  },
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: widget._bank.snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Text('Getting questions...');
          } else {
            return buildList(snapshot.data);
          }
        });
  }
}

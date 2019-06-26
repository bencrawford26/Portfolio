import 'package:flutter/material.dart';

import '../user/user.dart';
import '../user/user_nav_drawer.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class MessageCreator extends StatefulWidget {
  final User _user;
  final Firestore firestore;

  MessageCreator(this._user, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return MessageCreatorState();
  }
}

class MessageCreatorState extends State<MessageCreator> {
  final formKey = new GlobalKey<FormState>();

  String _recipient;
  String _subject;
  String _content;

  bool validateMessage() {
    final form = formKey.currentState;
    if (form.validate()) {
      form.save();
      return true;
    } else {
      return false;
    }
  }

  void sendMessage(DocumentSnapshot u, CollectionReference msgs) {
    if (validateMessage()) {
      widget._user.createMessage(
          widget._user.username, _recipient, _subject, _content, msgs);
      Navigator.pop(context);
    }
  }

  DocumentSnapshot searchForUser(
      List<DocumentSnapshot> userList, String userToFind) {
    for (int i = 0; i < userList.length; i++) {
      if (userToFind == userList[i]['username']) {
        print('User found');
        return userList[i];
      } else {
        print('User $i no match');
      }
    }
    return null;
  }

  CollectionReference get messages => widget.firestore.collection('messages');

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
        stream: widget.firestore.collection('users').snapshots(),
        builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
          if (snapshot.hasData) {
            return Scaffold(
              appBar: AppBar(
                title: Text('New Message'),
              ),
              body: Form(
                key: formKey,
                child: ListView(
                  children: <Widget>[
                    TextFormField(
                      decoration: InputDecoration(labelText: 'To:'),
                      validator: (value) {
                        if (value.isEmpty) return 'Please enter a recipient';
                        if (searchForUser(snapshot.data.documents, value) ==
                            null) return 'User not found';
                      },
                      onSaved: (value) => _recipient = value,
                    ),
                    TextFormField(
                      decoration: InputDecoration(labelText: 'Subject:'),
                      validator: (value) =>
                          value.isEmpty ? 'Please enter a subject' : null,
                      onSaved: (value) => _subject = value,
                    ),
                    TextFormField(
                      decoration: InputDecoration(labelText: 'Message:'),
                      maxLines: null,
                      validator: (value) =>
                          value.isEmpty ? 'Please enter a message' : null,
                      onSaved: (value) => _content = value,
                    ),
                    FlatButton(
                        child: Text('Send'),
                        color: Theme.of(context).accentColor,
                        textColor: Colors.white,
                        onPressed: () {
                          DocumentSnapshot _u = searchForUser(
                              snapshot.data.documents, _recipient);
                          print(searchForUser(
                              snapshot.data.documents, _recipient));
                          sendMessage(_u, messages);
                        }),
                  ],
                ),
              ),
              drawer: UserNavDrawer(widget._user, widget.firestore),
            );
          }
        });
  }
}

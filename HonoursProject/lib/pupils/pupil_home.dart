import 'package:flutter/material.dart';

import '../user/user_nav_drawer.dart';
import '../user/user.dart';
import '../request_list.dart';
import './pupil_list.dart';
import 'package:quiz_app/loading_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class PupilHome extends StatefulWidget {
  final User _user;
  final Firestore firestore;

  PupilHome(this._user, this.firestore);
  @override
  State<StatefulWidget> createState() {
    return PupilHomeState();
  }
}

class PupilHomeState extends State<PupilHome> {
  void addPupil(BuildContext context, List<DocumentSnapshot> docs) {
    String _pupilToAdd;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Add Pupil'),
          content: TextField(
            decoration: InputDecoration(
              hintText: 'Username',
            ),
            onChanged: (String text) {
              _pupilToAdd = text;
            },
          ),
          actions: <Widget>[
            FlatButton(
              child: Text('Submit'),
              color: Color.fromARGB(80, 220, 220, 220),
              onPressed: () => searchForUser(_pupilToAdd, docs),
            ),
            FlatButton(
              child: Text('Cancel'),
              color: Color.fromARGB(80, 220, 220, 220),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        );
      },
    );
  }

  void searchForUser(String _pupil, List<DocumentSnapshot> users) {
    for (int i = 0; i < users.length; i++) {
      if (_pupil == users[i]['username']) {
        print('User found');
        setState(() {
          widget._user.addPupilRequest(widget._user, _pupil, widget.firestore);
        });
        Navigator.pop(context);
        return;
      } else {
        print('User $i no match');
      }
    }
  }

  Color setRequestIconColour(DocumentSnapshot userBeingViewed) {
    if (userBeingViewed['pupilRequests'].isEmpty) return Colors.white;
    return Colors.red;
  }

  AppBar buildAppBar(DocumentSnapshot userBeingViewed) {
    return AppBar(
      title: Text(widget._user.username + '\'s Pupils'),
      actions: <Widget>[
        IconButton(
          icon: Icon(
            Icons.add_alert,
            color: setRequestIconColour(userBeingViewed),
          ),
          onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => RequestList(widget._user,
                        widget._user.pupilRequests, true, widget.firestore)),
              ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: widget.firestore.collection('users').snapshots(),
        builder: (BuildContext context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingPage(titleText: 'Getting pupils');
          }
          if (snapshot.hasData) {
            List<DocumentSnapshot> pupilList = [];
            DocumentSnapshot userBeingViewed;
            for (int i = 0; i < snapshot.data.documents.length; i++) {
              if (snapshot.data.documents[i]['tutors']
                  .contains(widget._user.username))
                pupilList.add(snapshot.data.documents[i]);
              if(snapshot.data.documents[i]['username'] == widget._user.username) userBeingViewed = snapshot.data.documents[i];
            }
            return Scaffold(
              appBar: buildAppBar(userBeingViewed),
              body: PupilList(widget._user, pupilList, widget.firestore),
              drawer: UserNavDrawer(widget._user, widget.firestore),
              floatingActionButton: FloatingActionButton(
                child: Icon(
                  Icons.add,
                  size: 32.0,
                ),
                onPressed: () => addPupil(context, snapshot.data.documents),
              ),
            );
          }
        });
  }
}

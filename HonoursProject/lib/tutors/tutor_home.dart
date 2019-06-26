import 'package:flutter/material.dart';

import '../user/user_nav_drawer.dart';
import '../user/user.dart';
import '../request_list.dart';
import './tutor_list.dart';
import 'package:quiz_app/loading_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TutorHome extends StatefulWidget {
  final User _user;
  final Firestore firestore;

  TutorHome(this._user, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return TutorHomeState();
  }
}

class TutorHomeState extends State<TutorHome> {
  void addTutor(BuildContext context, List<DocumentSnapshot> docs) {
    String _tutorToAdd;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Add Tutor'),
          content: TextField(
            decoration: InputDecoration(
              hintText: 'Username',
            ),
            onChanged: (String text) {
              _tutorToAdd = text;
            },
          ),
          actions: <Widget>[
            FlatButton(
              child: Text('Submit'),
              color: Color.fromARGB(80, 220, 220, 220),
              onPressed: () => searchForUser(_tutorToAdd, docs),
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

  void searchForUser(String _tutor, List<DocumentSnapshot> users) {
    for (int i = 0; i < users.length; i++) {
      if (_tutor == users[i]['username']) {
        print('User found');
        setState(() {
          widget._user.addTutorRequest(widget._user, _tutor, widget.firestore);
        });
        Navigator.pop(context);
        return;
      } else {
        print('User $i no match');
      }
    }
  }

  Color setRequestIconColour(DocumentSnapshot userBeingViewed) {
    if (userBeingViewed['tutorRequests'].isEmpty) return Colors.white;
    return Colors.red;
  }

  AppBar buildAppbar(DocumentSnapshot userBeingViewed) {
    return AppBar(
      title: Text(widget._user.username + '\'s Tutors'),
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
                      widget._user.tutorRequests, false, widget.firestore),
                ),
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
            return LoadingPage(titleText: 'Getting tutors');
          }
          if (snapshot.hasData) {
            List<DocumentSnapshot> tutorList = [];
            DocumentSnapshot userBeingViewed;
            for (int i = 0; i < snapshot.data.documents.length; i++) {
              if (snapshot.data.documents[i]['pupils']
                  .contains(widget._user.username))
                // print(snapshot.data.documents[i]);
                tutorList.add(snapshot.data.documents[i]);
                if(snapshot.data.documents[i]['username'] == widget._user.username) userBeingViewed = snapshot.data.documents[i];
            }
            return Scaffold(
              appBar: buildAppbar(userBeingViewed),
              body: TutorList(widget._user, tutorList, widget.firestore),
              drawer: UserNavDrawer(widget._user, widget.firestore),
              floatingActionButton: FloatingActionButton(
                child: Icon(
                  Icons.add,
                  size: 32.0,
                ),
                onPressed: () => addTutor(context, snapshot.data.documents),
              ),
            );
          }
        });
  }
}

import 'package:flutter/material.dart';

import './user/user.dart';
import 'loading_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class RequestList extends StatefulWidget {
  final User _user;
  final List<dynamic> _requests;
  final bool _pupil;
  final Firestore firestore;

  RequestList(this._user, this._requests, this._pupil, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return RequestListState();
  }
}

class RequestListState extends State<RequestList> {
  void acceptRequest(int i) {
    if (widget._pupil) {
      setState(() {
        widget._user.addPupil(
            widget._user.username, widget._requests[i], widget.firestore);
        widget._user.addTutor(
            widget._requests[i], widget._user.username, widget.firestore);
        print(widget._user.tutors);
        print(widget._user.pupils);
        print(widget._pupil.toString());
        //widget._user.removeRequest(widget._requests, widget._requests[i]);
      });
    } else {
      setState(() {
        widget._user.addTutor(
            widget._user.username, widget._requests[i], widget.firestore);
        widget._user.addPupil(
            widget._requests[i], widget._user.username, widget.firestore);
        print(widget._user.tutors);
        print(widget._user.pupils);
        print(widget._pupil.toString());
        //widget._user.removeRequest(widget._requests, widget._requests[i]);
      });
    }
  }

  String getPupilOrTutor(bool pupil) {
    if (pupil) {
      return 'pupil';
    } else {
      return 'tutor';
    }
  }

  Widget showRequests() {
    return StreamBuilder(
        stream: widget.firestore
            .collection('users')
            .document(widget._user.username)
            .snapshots(),
        builder: (BuildContext context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingPage(
              titleText: 'Getting requests...',
            );
          } else {
            if (snapshot
                    .data[getPupilOrTutor(widget._pupil) + 'Requests'].length ==
                0) {
              return Center(child: Text('No new requests'));
            }
            return ListView.builder(
              itemBuilder: (BuildContext context, int index) => ExpansionTile(
                    title: Text(snapshot
                            .data[getPupilOrTutor(widget._pupil) + 'Requests']
                        [index]),
                    children: <Widget>[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: <Widget>[
                          Column(
                            children: <Widget>[
                              Text('Accept'),
                              IconButton(
                                icon: Icon(Icons.check),
                                onPressed: () => acceptRequest(index),
                              ),
                            ],
                          ),
                          Column(
                            children: <Widget>[
                              Text('Decline'),
                              IconButton(
                                icon: Icon(Icons.clear),
                                onPressed: () {},
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
              itemCount: widget._requests.length,
            );
          }
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget._user.username + '\'s Requests'),
      ),
      body: showRequests(),
    );
  }
}

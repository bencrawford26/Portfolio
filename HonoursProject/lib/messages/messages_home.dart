import 'package:flutter/material.dart';

import '../user/user.dart';
import '../user/user_nav_drawer.dart';
import './message_list.dart';
import 'package:quiz_app/loading_page.dart';
import './message_creator.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class MessagesHome extends StatefulWidget {
  final User _user;
  final Firestore firestore;

  MessagesHome(this._user, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return MessagesHomeState();
  }
}

class MessagesHomeState extends State<MessagesHome>
    with SingleTickerProviderStateMixin {
  final List<Tab> messageTabs = <Tab>[
    new Tab(text: 'Inbox'),
    new Tab(text: 'Sent Messages'),
  ];

  TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: messageTabs.length);
  }

  void displayMessageCreator(User u) {
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => MessageCreator(u, widget.firestore)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
        stream: widget.firestore.collection('messages').snapshots(),
        builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingPage(titleText: 'Getting messages...');
          } else if (snapshot.hasData) {
            List<Map> inbox = [];
            List<Map> sentMessages = [];

            for (int i = 0; i < snapshot.data.documents.length; i++) {
              if (snapshot.data.documents[i]['recipient'] ==
                  widget._user.username) {
              inbox.add({
                  'sender': snapshot.data.documents[i]['sender'],
                  'recipient': snapshot.data.documents[i]['recipient'],
                  'subject': snapshot.data.documents[i]['subject'],
                  'content': snapshot.data.documents[i]['content'],
                  'dateTime': snapshot.data.documents[i]['dateTime'],
                  'read': snapshot.data.documents[i]['read'],
                });
              }
              if (snapshot.data.documents[i]['sender'] ==
                  widget._user.username) {
                sentMessages.add({
                  'sender': snapshot.data.documents[i]['sender'],
                  'recipient': snapshot.data.documents[i]['recipient'],
                  'subject': snapshot.data.documents[i]['subject'],
                  'content': snapshot.data.documents[i]['content'],
                  'dateTime': snapshot.data.documents[i]['dateTime'],
                  'read': snapshot.data.documents[i]['read'],
                });
              }
            }

            return Scaffold(
              appBar: AppBar(
                title: Text('${widget._user.username}\'s Messages'),
                bottom: TabBar(controller: _tabController, tabs: messageTabs),
              ),
              body: TabBarView(
                controller: _tabController,
                children: <Widget>[
                  MessageList(inbox, true),
                  MessageList(sentMessages, false),
                ],
              ),
              floatingActionButton: RaisedButton(
                color: Theme.of(context).accentColor,
                textColor: Colors.white,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.only(right: 8.0),
                      child: Icon(
                        Icons.message,
                        size: 32.0,
                      ),
                    ),
                    Text('Send Message'),
                  ],
                ),
                onPressed: () {
                  displayMessageCreator(widget._user);
                },
              ),
              drawer: UserNavDrawer(widget._user, widget.firestore),
            );
          }
        });
  }
}

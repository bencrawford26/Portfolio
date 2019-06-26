import 'package:flutter/material.dart';

import 'package:quiz_app/user/user.dart';
import 'package:quiz_app/user/user_nav_drawer.dart';
import 'package:quiz_app/progress/course_progress.dart';
import 'package:quiz_app/progress/bank_progress.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class CourseProgressHome extends StatefulWidget {
  final User _user;
  final Firestore _firestore;

  CourseProgressHome(this._user, this._firestore);

  @override
  State<StatefulWidget> createState() {
    return CourseProgressHomeState();
  }
}

class CourseProgressHomeState extends State<CourseProgressHome>
    with SingleTickerProviderStateMixin {
  final List<Tab> progressTabs = <Tab>[
    new Tab(text: 'Course Progress'),
    new Tab(text: 'Quiz Progress'),
  ];

  TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: progressTabs.length);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pupil Progress'),
        bottom: TabBar(controller: _tabController, tabs: progressTabs),
      ),
      body: TabBarView(
        controller: _tabController,
        children: <Widget>[
          CourseProgress(widget._user, widget._firestore),
          BankProgress(widget._user, widget._firestore),
        ],
      ),
      drawer: UserNavDrawer(widget._user, widget._firestore),
    );
  }
}

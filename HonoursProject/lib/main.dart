import 'dart:async';

import 'package:flutter/material.dart';

import './login/login_register.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

Future<void> main() async {
  final FirebaseApp app = await FirebaseApp.configure(
    name: 'test',
    options: const FirebaseOptions(
      googleAppID: '1:731799469749:android:9d0ee71c398365ce',
      gcmSenderID: '731799469749',
      apiKey: 'AIzaSyBa2pY1sHmS-Cl7965VsAqym0_dLL2zccM',
      projectID: 'quiz-test-45ae6',
    ),
  );
  final Firestore firestore = Firestore(app: app);
  await firestore.settings(timestampsInSnapshotsEnabled: true);

  runApp(new MyApp(firestore: firestore));
}

class MyApp extends StatelessWidget {
  MyApp({this.firestore});
  final Firestore firestore;
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Mobile Quiz',
      theme: new ThemeData(
        brightness: Brightness.light,
        primarySwatch: Colors.cyan,
        accentColor: Colors.blue,
        primaryIconTheme:
            Theme.of(context).primaryIconTheme.copyWith(color: Colors.white),
        primaryTextTheme:
            Theme.of(context).primaryTextTheme.apply(bodyColor: Colors.white),
        fontFamily: 'Raleway',
      ),
      home: EntryPage(
        firestore: firestore,
      ),
      initialRoute: '/',
    );
  }
}

class EntryPage extends StatelessWidget {
  EntryPage({this.firestore});
  final Firestore firestore;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Text(
            'Welcome!',
            textAlign: TextAlign.center,
          ),
        ),
        body: LoginRegister(firestore: firestore));
  }
}

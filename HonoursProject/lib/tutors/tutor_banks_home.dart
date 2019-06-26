import 'package:flutter/material.dart';

import '../user/user_nav_drawer.dart';
import '../user/user.dart';
import '../quiz/bank_tiles.dart';
import 'package:quiz_app/loading_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class TutorBanksHome extends StatefulWidget {
  final User _user;
  final DocumentSnapshot _tutor;
  final Firestore firestore;

  TutorBanksHome(this._user, this._tutor, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return TutorBanksHomeState();
  }
}

class TutorBanksHomeState extends State<TutorBanksHome> {
  // void updateUserBanks(_bank) {
  //   setState(() {
  //     widget._user.addBank(_bank);
  //   });
  // }

  Widget checkCreatedBanks(List<dynamic> banks, int totalUserBanks) {
    if (banks.isEmpty)
      return Center(child: Text('No banks to show.'));
    else
      return GridView.count(
        crossAxisCount: 2,
        crossAxisSpacing: 1.0,
        mainAxisSpacing: 1.0,
        scrollDirection: Axis.vertical,
        children: List.generate(
          banks.length,
          (index) {
            final Map _bank = {
              'bank': banks[index]['bank'],
              'editable': banks[index]['editable'],
              'total':banks[index]['total'],
              'creator': banks[index]['creator'],
              'name': banks[index]['name'],
              'participants': banks[index]['participants']
            };
            return BankTiles(
                _bank, widget._user, (totalUserBanks - 1), widget.firestore);
          },
        ),
      );
  }

  int numberOfBanks(List<DocumentSnapshot> banks) {
    int n = 0;
    for (int i = 0; i < banks.length; i++) {
      if (banks[i]['participants'].contains(widget._user.username)) n++;
    }
    return n;
  }
  @override
  Widget build(BuildContext context) {
    int totalUserBanks = widget._user.banks.length;
    widget._user.updateAllUserData(widget.firestore.collection('users'), widget._user);
    return StreamBuilder(
        stream: widget.firestore
            .collection('quizBanks')
            .where('creator', isEqualTo: widget._tutor['username'])
            .snapshots(),
        builder: (BuildContext context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingPage(titleText: 'Getting tutor banks');
          } else {
            print(snapshot.data.documents);
            return Scaffold(
              appBar: AppBar(
                title: Text('${widget._tutor['username']}\'s Question Banks'),
              ),
              body: checkCreatedBanks(snapshot.data.documents, totalUserBanks),
              drawer: UserNavDrawer(widget._user, widget.firestore),
            );
          }
        });
  }
}

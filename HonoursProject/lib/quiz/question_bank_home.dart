import 'package:flutter/material.dart';

import '../user/user_nav_drawer.dart';
import '../user/user.dart';
import './bank_tiles.dart';
import './bank_creator.dart';
import 'package:quiz_app/loading_page.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class QuestionBankHome extends StatefulWidget {
  final User _user;
  final Firestore firestore;

  QuestionBankHome(this._user, this.firestore);

  @override
  State<StatefulWidget> createState() {
    return QuestionBankHomeState();
  }
}

class QuestionBankHomeState extends State<QuestionBankHome> {
  User updatedUser;

  AlertDialog confirmNewBank(
      BuildContext context, List<DocumentSnapshot> banks) {
    return AlertDialog(
      title: Text('Add Bank'),
      content: SingleChildScrollView(
        child: ListBody(
          children: <Widget>[
            Text(
                'Would you like to create a new question bank? This will be visible to all of your pupils.'),
          ],
        ),
      ),
      actions: <Widget>[
        Column(
          children: <Widget>[
            Text('Yes'),
            IconButton(
              icon: Icon(Icons.check),
              onPressed: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          BankCreator(widget._user, banks, widget.firestore)),
                );
              },
            ),
          ],
        ),
        Column(
          children: <Widget>[
            Text('No'),
            IconButton(
              icon: Icon(Icons.clear),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ],
    );
  }

  Map mapBank(DocumentSnapshot bankToMap) {
    Map bank = {
      'bank': bankToMap['bank'],
      'editable': bankToMap['editable'],
      'total': bankToMap['total'],
      'creator': bankToMap['creator'],
      'name': bankToMap['name'],
      'participants': bankToMap['participants']
    };
    return bank;
  }

  int getUserBankNo(AsyncSnapshot<dynamic> snapshot) {
    int n = 0;
    for (int i = 0; i < snapshot.data.documents.length; i++) {
      for (int j = 0; j < widget._user.banks.length; j++) {
        if (snapshot.data.documents[i]['name'] ==
            widget._user.banks[j]['bankName']) n = j;
      }
    }
    return n;
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
    return new StreamBuilder(
      stream: widget.firestore.collection('quizBanks').snapshots(),
      builder: (BuildContext context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return LoadingPage(titleText: 'Getting banks...');
        } else if (snapshot.hasData) {
          return Scaffold(
            appBar: AppBar(
              title: Text('Question Banks'),
            ),
            body: GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 1.0,
              mainAxisSpacing: 1.0,
              scrollDirection: Axis.vertical,
              children: List.generate(
                numberOfBanks(snapshot.data.documents),
                (index) {
                  if (snapshot.data.documents[index]['participants']
                      .contains(widget._user.username)) {
                    final _bank = mapBank(snapshot.data.documents[index]);
                    return BankTiles(_bank, widget._user,
                        getUserBankNo(snapshot), widget.firestore);
                  }
                },
              ),
            ),
            drawer: UserNavDrawer(widget._user, widget.firestore),
            floatingActionButton: FloatingActionButton(
              child: Icon(
                Icons.add,
                size: 32.0,
              ),
              onPressed: () => showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return confirmNewBank(context, snapshot.data.documents);
                  }),
            ),
          );
        }
      },
    );
  }
}

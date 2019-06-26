import '../src/question.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

class User {
  String username;
  String password;
  String course;
  int correctAnswers;
  int incorrectAnswers;
  List<dynamic> banks;
  List<dynamic> createdBanks;
  List<dynamic> pupils;
  List<dynamic> tutors;
  List<dynamic> pupilRequests;
  List<dynamic> tutorRequests;
  Map messages;
  Map totalQuizTime;

  User(
      {this.username,
      this.password,
      this.course,
      this.banks,
      this.createdBanks,
      this.correctAnswers,
      this.incorrectAnswers,
      this.pupils,
      this.tutors,
      this.pupilRequests,
      this.tutorRequests,
      this.messages,
      this.totalQuizTime});

  Future<void> createMessage(String send, String rec, String sub, String con,
      CollectionReference messages) async {
    await messages.add(<String, dynamic>{
      'sender': send,
      'recipient': rec,
      'subject': sub,
      'content': con,
      'dateTime': DateTime.now(),
      'read': false,
    });
  }

  Future<void> updateAllUserData(CollectionReference users, User u) async {
    print(u.course);
    await users.document(u.username).setData(<String, dynamic>{
      'username': u.username,
      'password': u.password,
      'course': u.course,
      'correctAnswers': u.correctAnswers,
      'incorrectAnswers': u.incorrectAnswers,
      'banks': u.banks,
      'createdBanks': u.createdBanks,
      'pupils': u.pupils,
      'tutors': u.tutors,
      'pupilRequests': u.pupilRequests,
      'tutorRequests': u.tutorRequests,
      'messages': u.messages,
      'totalQuizTime': u.totalQuizTime
    });
  }

  User getUserFromDB(DocumentSnapshot u) {
    User user = User(
      username: u['username'],
      banks: u['banks'],
      correctAnswers: u['correctAnswers'],
      course: u['course'],
      createdBanks: u['createdBanks'],
      incorrectAnswers: u['incorrectAnswers'],
      messages: u['messages'],
      password: u['password'],
      pupilRequests: u['pupilRequests'],
      pupils: u['pupils'],
      totalQuizTime: u['totalQuizTime'],
      tutorRequests: u['tutorRequests'],
      tutors: u['tutors'],
    );

    return user;
  }

  bool checkMaxQs() {
    if (correctAnswers == getTotalQuestions()) {
      return false;
    } else {
      return true;
    }
  }

  int getTotalQuestions() {
    int t = 0;
    for (int i = 0; i < banks.length; i++) {
      t += banks[i]['total'];
    }
    return t;
  }

  bool checkMaxBanks() {
    if (banks.length == allQuestions.length) {
      return false;
    } else {
      return true;
    }
  }

  int getBanksOpened() {
    int t = 0;
    if (banks.isEmpty) return 0;

    for (int i = 0; i < banks.length; i++) {
      if (banks[i]['opened']) t++;
    }
    return t;
  }

  int getAttemptedAnswers() {
    int n = 0;
    for (int i = 0; i < banks.length; i++) {
      for (int j = 0; j < banks[i]['total']; j++) {
        if (banks[i]['questionStates'][j]['answered']) {
          n++;
        }
      }
    }
    return n;
  }

  void setAnswered(Map q) {
    q['answered'] = true;
  }

  int getCorrectAnswers() {
    int n = 0;
    for (int i = 0; i < banks.length; i++) {
      for (int j = 0; j < banks[i]['total']; j++) {
        if (banks[i]['questionStates'][j]['correct']) {
          n++;
        }
      }
    }
    return n;
  }

  void setBasicBanks() {
    print('setBasicBanks');
    for (int i = 0; i < allQuestions.length; i++) {
      if (!banks.contains(allQuestions[i])) banks.add(allQuestions[i]);
    }
  }

  void setCorrect(Map q) {
    q['correct'] = true;
  }

  void createBank(String _name, User _creator, Firestore f) async {
    await f.collection('quizBanks').document(_name).setData(<String, dynamic>{
      'bank': [],
      'name': _name,
      'creator': _creator.username,
      'total': 0,
      'editable': true,
      'participants': [_creator.username] + turnPupilsToStrings(_creator)
    });
    await f
        .collection('users')
        .document(_creator.username)
        .updateData(<String, dynamic>{
      'createdBanks': FieldValue.arrayUnion([_name])
    });
    //updateAllUserData(f.collection('users'), _creator);
  }

  void createTest(String _name, User _creator, Firestore _f) async {
    await _f.collection('tests').document(_name).setData(<String, dynamic>{
      'bank': [],
      'name': _name,
      'creator': _creator.username,
      'total': 0,
      'editable': true,
      'participants': [_creator.username] + turnPupilsToStrings(_creator)
    });
    await _f
        .collection('users')
        .document(_creator.username)
        .updateData(<String, dynamic>{
      'createdBanks': FieldValue.arrayUnion([_name])
    });
  }

  List<String> turnPupilsToStrings(User u) {
    List<String> newPupilList = [];
    for (var i = 0; i < u.pupils.length; i++) {
      newPupilList.add(u.pupils[i].toString());
    }
    return newPupilList;
  }

  // void addBank(Map b) {
  //   for (int i = 0; i < banks.length; i++) {
  //     if (b['name'] == banks[i]['name']) return;
  //   }
  //   banks.add(b);
  //   createdBanks.add(b);
  // }

  void createTestQuestion(
      String q,
      String a1,
      bool a1c,
      String a2,
      bool a2c,
      String a3,
      bool a3c,
      String a4,
      bool a4c,
      DocumentReference b,
      Firestore f) {
    addQuestion(
      {
        'question': q,
        'answers': [
          {
            'answer': a1,
            'correct': a1c,
          },
          {
            'answer': a2,
            'correct': a2c,
          },
          {
            'answer': a3,
            'correct': a3c,
          },
          {
            'answer': a4,
            'correct': a4c,
          },
        ],
      },
      b,
      f,
    );
  }

  void createQuizQuestion(
      String q,
      String a1,
      bool a1c,
      String a2,
      bool a2c,
      String a3,
      bool a3c,
      String a4,
      bool a4c,
      String exp,
      DocumentReference b,
      Firestore f) {
    addQuestion(
      {
        'question': q,
        'answers': [
          {
            'answer': a1,
            'correct': a1c,
          },
          {
            'answer': a2,
            'correct': a2c,
          },
          {
            'answer': a3,
            'correct': a3c,
          },
          {
            'answer': a4,
            'correct': a4c,
          },
        ],
        'explanation': exp,
      },
      b,
      f,
    );
  }

  void editTestQuestion(
      String q,
      String a1,
      bool a1c,
      String a2,
      bool a2c,
      String a3,
      bool a3c,
      String a4,
      bool a4c,
      DocumentReference b,
      Map toUpdate,
      int questionNo,
      Firestore f) {
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot bankSnapshot = await tx.get(b);
      if (bankSnapshot.exists) {
        await tx.update(b, <String, dynamic>{
          'bank': FieldValue.arrayRemove([toUpdate]),
        });
        await tx.update(b, <String, dynamic>{
          'bank': FieldValue.arrayUnion([
            {
              'question': q,
              'answers': [
                {
                  'answer': a1,
                  'correct': a1c,
                },
                {
                  'answer': a2,
                  'correct': a2c,
                },
                {
                  'answer': a3,
                  'correct': a3c,
                },
                {
                  'answer': a4,
                  'correct': a4c,
                },
              ]
            }
          ])
        });
      }
    });
  }

  void editQuizQuestion(
      String q,
      String a1,
      bool a1c,
      String a2,
      bool a2c,
      String a3,
      bool a3c,
      String a4,
      bool a4c,
      String exp,
      DocumentReference b,
      Map toUpdate,
      int questionNo,
      Firestore f) {
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot bankSnapshot = await tx.get(b);
      if (bankSnapshot.exists) {
        await tx.update(b, <String, dynamic>{
          'bank': FieldValue.arrayRemove([toUpdate]),
        });
        await tx.update(b, <String, dynamic>{
          'bank': FieldValue.arrayUnion([
            {
              'question': q,
              'answers': [
                {
                  'answer': a1,
                  'correct': a1c,
                },
                {
                  'answer': a2,
                  'correct': a2c,
                },
                {
                  'answer': a3,
                  'correct': a3c,
                },
                {
                  'answer': a4,
                  'correct': a4c,
                },
              ],
              'explanation': exp,
            }
          ])
        });
      }
    });
  }

  void addQuestion(Map q, DocumentReference b, Firestore f) {
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot bankSnapshot = await tx.get(b);
      if (bankSnapshot.exists) {
        await tx.update(b, <String, dynamic>{
          'bank': FieldValue.arrayUnion([q]),
          'total': (bankSnapshot.data['total'] + 1)
        });
      }
    });
  }

  void deleteQuestion(DocumentReference b, Map q, Firestore f) {
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot bankSnapshot = await tx.get(b);
      if (bankSnapshot.exists) {
        print('found bank');
        for (int i = 0; i < bankSnapshot.data.length; i++) {
          if (bankSnapshot.data['bank'][i]['question'] == q['question']) {
            await tx.update(b, <String, dynamic>{
              'bank': FieldValue.arrayRemove([q]),
              'total': (bankSnapshot.data['total'] - 1)
            });
          }
        }
      }
    });
  }

  DocumentReference getBankByName(
      String _bankName, CollectionReference quizBanks) {
    return quizBanks.document(_bankName);
    // for (int i = 0; i < quizBanks.length; i++) {
    //   if (_bankName == allBanks[i]['name']) return allBanks[i];
    // }
    // return null;
  }

  void addPupil(String t, String p, Firestore f) {
    DocumentReference tutorRef = f.collection('users').document(t);
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot tutorSnapshot = await tx.get(tutorRef);
      if (tutorSnapshot.exists) {
        if (tutorSnapshot.data['pupilRequests'].contains(p)) {
          await tx.update(tutorRef, <String, dynamic>{
            'pupils': FieldValue.arrayUnion([p]),
            'pupilRequests': FieldValue.arrayRemove([p])
          });
        } else {
          await tx.update(tutorRef, <String, dynamic>{
            'pupils': FieldValue.arrayUnion([p]),
          });
        }
      }
    });
  }

  void addPupilRequest(User sender, String targetPupil, Firestore f) {
    for (int i = 0; i < pupils.length; i++) {
      if (targetPupil == pupils[i]) return;
    }
    DocumentReference tutorRef = f.collection('users').document(targetPupil);
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot tutorSnapshot = await tx.get(tutorRef);
      if (tutorSnapshot.exists) {
        await tx.update(tutorRef, <String, dynamic>{
          'tutorRequests': FieldValue.arrayUnion([sender.username])
        });
      }
    });
  }

  void addTutor(String p, String t, Firestore f) {
    DocumentReference pupilRef = f.collection('users').document(p);
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot pupilSnapshot = await tx.get(pupilRef);
      if (pupilSnapshot.exists) {
        if (pupilSnapshot.data['tutorRequests'].contains(t)) {
          await tx.update(pupilRef, <String, dynamic>{
            'tutors': FieldValue.arrayUnion([t]),
            'tutorRequests': FieldValue.arrayRemove([t])
          });
        } else {
          await tx.update(pupilRef, <String, dynamic>{
            'tutors': FieldValue.arrayUnion([t]),
          });
        }
      }
    });
  }

  void addTutorRequest(User sender, String targetTutor, Firestore f) {
    for (int i = 0; i < tutors.length; i++) {
      if (targetTutor == tutors[i]) return;
    }
    DocumentReference tutorRef = f.collection('users').document(targetTutor);
    f.runTransaction((Transaction tx) async {
      DocumentSnapshot tutorSnapshot = await tx.get(tutorRef);
      if (tutorSnapshot.exists) {
        await tx.update(tutorRef, <String, dynamic>{
          'pupilRequests': FieldValue.arrayUnion([sender.username])
        });
      }
    });
  }

  void removeRequest(List<dynamic> _reqList, String _req) {
    _reqList.remove(_req);
  }

  void addToTotalQuizTime(Duration _toAdd) {
    totalQuizTime['microseconds'] += _toAdd.inMicroseconds;
    totalQuizTime['milliseconds'] += _toAdd.inMilliseconds;
    totalQuizTime['seconds'] += _toAdd.inSeconds;
    totalQuizTime['minutes'] += _toAdd.inMinutes;
    totalQuizTime['hours'] += _toAdd.inHours;
    totalQuizTime['days'] += _toAdd.inDays;
  }

  int increaseCorrectAnswers() {
    if (checkMaxQs()) return correctAnswers++;
    return correctAnswers;
  }

  int increaseIncorrectAnswers() {
    if (checkMaxQs()) return incorrectAnswers++;
    return incorrectAnswers;
  }
}

class Request {
  String sentBy;

  Request({this.sentBy});
}

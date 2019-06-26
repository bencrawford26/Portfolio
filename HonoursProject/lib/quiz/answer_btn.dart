import 'package:flutter/material.dart';

class AnswerBtn extends StatelessWidget {
  final String ansText;
  final bool correct;
  final Function nextQ;

  AnswerBtn(this.ansText, this.correct, this.nextQ);

  @override
  Widget build(BuildContext context) {
    final double btnWidth = MediaQuery.of(context).size.width - 20;

    return Row(
      children: <Widget>[
        Container(
          margin: EdgeInsets.fromLTRB(10.0, 10.0, 10.0, 0.0),
          child: ButtonTheme(
            minWidth: btnWidth,
            height: 50.0,
            child: RaisedButton(
              color: Colors.white,
              child: Text(
                ansText,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16.0
                ),
              ),
              onPressed: (checkCorrect),
            ),
          ),
        ),
      ],
    );
  }

  void checkCorrect() {
    if (correct) {
      print("CORRECT");
      nextQ(true);
    } else {
      print("FALSE");
      nextQ(false);
    }
  }
}

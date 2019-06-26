import 'package:flutter/material.dart';

class AnswerAlert extends StatelessWidget {
  final String _correctIncorrect;
  final String _explanation;

  AnswerAlert(this._correctIncorrect, this._explanation);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            padding: EdgeInsets.all(24.0),
            child: Text(
              _correctIncorrect,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24.0,
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.all(24.0),
            child: Text(
              _explanation,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24.0,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

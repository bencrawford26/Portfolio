import 'package:flutter/material.dart';

class QuestionCard extends StatelessWidget {
  final String question;

  QuestionCard(this.question);

  @override
  Widget build(BuildContext context) {

    final double cardWidth = MediaQuery.of(context).size.width - 20;

    return Card(
      margin: EdgeInsets.all(10.0),
      child: Container(
        padding: EdgeInsets.all(5.0),
        width: cardWidth,
        child: Text(
          question,
          textAlign: TextAlign.left,
          style: TextStyle(
            fontSize: 14.0,
            fontWeight: FontWeight.w500
            
          ),
        ),
      ),
    );
  }
}
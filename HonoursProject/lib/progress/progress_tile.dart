import 'package:flutter/material.dart';

class ProgressTile extends StatelessWidget {
  final String title;
  final dynamic current;
  final int total;

  ProgressTile({this.title, this.current, this.total});

  Text getContent() {
    if (this.total == null) {
      return Text(
        '$current',
        style: TextStyle(
          fontSize: 24.0,
          fontWeight: FontWeight.w600,
        ),
      );
    } else {
      return Text(
        '$current/$total',
        style: TextStyle(
          fontSize: 24.0,
          fontWeight: FontWeight.w600,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      title: Text(
        title,
        style: TextStyle(fontSize: 20.0),
      ),
      children: <Widget>[
        Card(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: <Widget>[
              getContent(),
            ],
          ),
        ),
      ],
    );
  }
}

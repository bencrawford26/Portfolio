import 'package:flutter/material.dart';

class InstructionText extends StatelessWidget {
  final String _instructions;

  InstructionText(this._instructions);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(16.0),
      child: Text(
        _instructions,
        style: TextStyle(
          fontSize: 20.0,
          fontWeight: FontWeight.w700,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}

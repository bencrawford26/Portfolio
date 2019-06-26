import 'package:flutter/material.dart';

class LoadingPage extends StatelessWidget {
  LoadingPage({this.titleText});
  final String titleText;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text(titleText),
      ),
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}

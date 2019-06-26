import 'package:flutter/material.dart';

class MessageList extends StatefulWidget {
  final List<dynamic> msgList;
  final bool isInbox;

  MessageList(this.msgList, this.isInbox);

  @override
  State<StatefulWidget> createState() {
    return MessageListState();
  }
}

class MessageListState extends State<MessageList> {
  String getToFrom(int index) {
    if (widget.isInbox) {
      return 'From: ${widget.msgList[index]['sender']}';
    } else {
      return 'To: ${widget.msgList[index]['recipient']}';
    }
  }

  String printDateTime(int index) {
    var date = DateTime.fromMillisecondsSinceEpoch(
        widget.msgList[index]['dateTime'].seconds * 1000);
    return date.toString();
    // widget.msgList[index]['dateTime'].seconds.toString();
    // '/' +
    // widget.msgList[index]['dateTime'].month.toString() +
    // '/' +
    // widget.msgList[index]['dateTime'].year.toString() +
    // '  ' +
    // (widget.msgList[index]['dateTime'].hour + 1).toString() +
    // ':' +
    // widget.msgList[index]['dateTime'].minute.toString();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: widget.msgList.length,
      itemBuilder: (BuildContext context, int index) {
        return ExpansionTile(
          title: Text(widget.msgList[index]['subject']),
          children: <Widget>[
            Row(
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text(
                    getToFrom(index),
                    style: TextStyle(fontSize: 16.0),
                  ),
                ),
              ],
            ),
            Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(widget.msgList[index]['content']),
            ),
            Row(
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Text(
                    printDateTime(index),
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                FlatButton(
                  child: Text('Reply'),
                  onPressed: () {},
                ),
                FlatButton(
                  child: Text('Delete'),
                  onPressed: () {},
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}

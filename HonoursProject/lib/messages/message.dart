class Message {
  String sender;
  String recipient;
  String subject;
  String content;
  DateTime dateTime;
  bool read;

  Message(
      {this.sender,
      this.recipient,
      this.subject,
      this.content,
      this.dateTime,
      this.read});
}

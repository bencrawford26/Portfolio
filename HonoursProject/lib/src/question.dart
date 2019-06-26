class Ans {
  final String ans;
  final bool correct;

  const Ans({
    this.correct,
    this.ans,
  });
}

class Question {
  final String question;
  final List<Ans> answers;
  final QuestionState qState;

  const Question({
    this.question,
    this.answers,
    this.qState,
  });
}

class QuestionState {
  bool answered = false;
  bool correct = false;
}

class QuestionBank {
  final List<Question> bank;
  final String name;
  final BankState bankState;

  const QuestionBank({
    this.bank,
    this.name,
    this.bankState,
  });
}

class BankState {
  bool opened = false;
  int total = 0;
  String creator = "";
  bool editable = false;

  BankState({this.total, this.creator, this.editable});
}

class AllQs {
  final List<QuestionBank> questionBanks;

  const AllQs({
    this.questionBanks,
  });
}

final List<Map> allQuestions = [
  // javaBasics,
  hTMLBasics,
  // cSSBasics,
  // javaScriptBasics,
];

final Map hTMLBasics = {
  'name': 'HTML Basics',
  'bank': [
    {
      'question': 'Test Q',
      'qState': {'answered': false, 'correct': false},
      'answers': [
        {
          'ans': 'ans1',
          'correct': false,
        },
        {
          'ans': 'ans2',
          'correct': false,
        },
        {
          'ans': 'ans3',
          'correct': true,
        },
        {
          'ans': 'ans4',
          'correct': false,
        },
      ],
    },
  ],
  'bankState': {
    'total': 1,
    'creator': '52335d71-d87f-4f98-89ae-1068ce545fa0',
    'editable': false,
  },
};

final QuestionBank cSSBasics = QuestionBank(
  name: 'CSS Basics',
  bank: [
    Question(
      question: 'Test Q',
      qState: QuestionState(),
      answers: [
        Ans(
          ans: 'ans1',
          correct: false,
        ),
        Ans(
          ans: 'ans2',
          correct: false,
        ),
        Ans(
          ans: 'ans3',
          correct: true,
        ),
        Ans(
          ans: 'ans4',
          correct: false,
        ),
      ],
    ),
  ],
  bankState: BankState(
    total: 1,
    creator: '52335d71-d87f-4f98-89ae-1068ce545fa0',
    editable: false,
  ),
);

final QuestionBank javaScriptBasics = QuestionBank(
  name: 'JavaScript Basics',
  bank: [
    Question(
      question: 'Test Q',
      qState: QuestionState(),
      answers: [
        Ans(
          ans: 'ans1',
          correct: false,
        ),
        Ans(
          ans: 'ans2',
          correct: false,
        ),
        Ans(
          ans: 'ans3',
          correct: true,
        ),
        Ans(
          ans: 'ans4',
          correct: false,
        ),
      ],
    ),
  ],
  bankState: BankState(
    total: 1,
    creator: '52335d71-d87f-4f98-89ae-1068ce545fa0',
    editable: false,
  ),
);

final QuestionBank javaBasics = QuestionBank(
  name: 'Java Basics',
  bankState: BankState(
    total: 10,
    creator: '52335d71-d87f-4f98-89ae-1068ce545fa0',
    editable: false,
  ),
  bank: [
    Question(
      question: "What is the range of short data type in Java?",
      qState: QuestionState(),
      answers: [
        Ans(ans: '-128 to 127', correct: false),
        Ans(ans: '-32768 to 32767', correct: true),
        Ans(ans: '-2147483648 to 2147483647', correct: false),
        Ans(ans: 'None of the above', correct: false),
      ],
    ),
    Question(
      question: "What is the range of byte data type in Java?",
      qState: QuestionState(),
      answers: [
        Ans(ans: "-128 to 127", correct: true),
        Ans(ans: "-32768 to 32767", correct: false),
        Ans(ans: "-2147483648 to 2147483647", correct: false),
        Ans(ans: "None of the above", correct: false),
      ],
    ),
    Question(
      question:
          "Which of the following are legal lines of Java code?\n1. int w = (int)888.8\n2. byte x = (byte)100L;\n3. long y = (byte)100;\n4. byte z = (byte)100L;",
      qState: QuestionState(),
      answers: [
        Ans(ans: "1 and 2", correct: false),
        Ans(ans: "2 and 3", correct: false),
        Ans(ans: "3 and 4", correct: false),
        Ans(ans: "All statements are correct.", correct: true),
      ],
    ),
    Question(
      question:
          "An expression involving byte, int, and literal numbers is promoted to which of these?",
      qState: QuestionState(),
      answers: [
        Ans(ans: "int", correct: true),
        Ans(ans: "long", correct: false),
        Ans(ans: "byte", correct: false),
        Ans(ans: "float", correct: false),
      ],
    ),
    Question(
      question:
          "Which of these literals can be contained in float data type variable?",
      qState: QuestionState(),
      answers: [
        Ans(ans: "-1.7e+308", correct: false),
        Ans(ans: "-3.4e+038", correct: true),
        Ans(ans: "1.7e+308", correct: false),
        Ans(ans: "-3.4e+050", correct: false),
      ],
    ),
    Question(
      question:
          "Which data type value is returned by all transcendental math functions?",
      qState: QuestionState(),
      answers: [
        Ans(ans: "int", correct: false),
        Ans(ans: "float", correct: false),
        Ans(ans: "double", correct: true),
        Ans(ans: "long", correct: false),
      ],
    ),
    Question(
      question: "What is the output of this program?\nclass average {" +
          "\n\tpublic static void main(String args[])" +
          "\n\t{" +
          "\n\t\tdouble num[] = { 5.5, 10.1, 11, 12.8, 56.9, 2.5 };" +
          "\n\t\tdouble result;" +
          "\n\t\tresult = 0;" +
          "\n\t\tfor (int i = 0; i < 6; ++i)" +
          "\n\t\t\tresult = result + num[i];" +
          "\n\t\tSystem.out.print(result / 6;" +
          "\n\t}" +
          "\n}",
      qState: QuestionState(),
      answers: [
        Ans(ans: "16.34", correct: false),
        Ans(ans: "16.566666644", correct: false),
        Ans(ans: "16.46666666666667", correct: true),
        Ans(ans: "16.46666666666666", correct: false),
      ],
    ),
    Question(
      question: "What will be the output of these statements?"
          "\nclass output {" +
          "\n\tpublic static void main(String args[])" +
          "\n\t{" +
          "\n\t\tdouble a, b, c;" +
          "\n\t\ta = 3.0 / 0;" +
          "\n\t\tb = 0 / 4.0;" +
          "\n\t\tc = 0 / 0.0;" +
          "\n\n\t\tSystem.out.println(a);" +
          "\n\t\tSystem.out.println(b);" +
          "\n\t\tSystem.out.println(c);" +
          "\n\t}" +
          "\n}",
      qState: QuestionState(),
      answers: [
        Ans(ans: "Infinity", correct: false),
        Ans(ans: "0.0", correct: false),
        Ans(ans: "NaN", correct: false),
        Ans(ans: "All of the above.", correct: true),
      ],
    ),
    Question(
      question: "What is the output of this program?" +
          "\nclass increment {" +
          "\n\tpublic static void main(String args[])" +
          "\n\t{" +
          "\n\t\tint g = 3;" +
          "\n\t\tSystem.out.print(++g * 8);" +
          "\n\t}" +
          "\n}",
      qState: QuestionState(),
      answers: [
        Ans(ans: "25", correct: false),
        Ans(ans: "24", correct: true),
        Ans(ans: "32", correct: false),
        Ans(ans: "33", correct: false),
      ],
    ),
    Question(
      question: "What is the output of this program?"
          "\nclass area {" +
          "\n\tpublic static void main(String args[])" +
          "\n\t{" +
          "\n\t\tdouble r, pi, a;" +
          "\n\t\tr = 9.8;" +
          "\n\t\tpi = 3.14;" +
          "\n\t\ta = pi * r * r;" +
          "\n\t\tSystem.out.println(a);" +
          "\n\t}" +
          "\n}",
      qState: QuestionState(),
      answers: [
        Ans(ans: "301.5656", correct: true),
        Ans(ans: "301", correct: false),
        Ans(ans: "301.56", correct: false),
        Ans(ans: "301.56560000", correct: false),
      ],
    ),
  ],
);

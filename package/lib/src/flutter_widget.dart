import 'package:flutter/widgets.dart';

class FlutterWidget extends StatelessWidget {
  final String greeting;
  const FlutterWidget({super.key, required this.greeting});

  @override
  Widget build(BuildContext context) {
    return Center(child: Text(greeting));
  }
}

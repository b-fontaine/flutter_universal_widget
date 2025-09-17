import 'package:flutter/widgets.dart';

class WidgetView extends StatelessWidget {
  final Map<Object?, Object?> initialData;
  const WidgetView({super.key, required this.initialData});

  @override
  Widget build(BuildContext context) {
    if (initialData['greeting'] != null) {
      return Text(initialData['greeting'] as String);
    }
    return const Text('Hello from Flutter!');
  }
}

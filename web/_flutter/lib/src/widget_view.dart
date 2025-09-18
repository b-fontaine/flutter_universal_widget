import 'package:flutter/widgets.dart';
import 'package:flutter_universal_widget/flutter_universal_widget.dart';

class WidgetView extends StatelessWidget {
  final Map<Object?, Object?> initialData;
  const WidgetView({super.key, required this.initialData});

  @override
  Widget build(BuildContext context) {
    if (initialData['greeting'] != null) {
      return FlutterWidget(greeting: initialData['greeting'] as String);
    }
    return const FlutterWidget(greeting: 'Hello from Flutter!');
  }
}

import 'dart:js_interop' as js; // .dartify()
import 'dart:ui_web' as ui_web; // getInitialData(viewId)

import 'package:flutter/widgets.dart';

class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final viewId = View.of(context).viewId;
    final js.JSAny? data = ui_web.views.getInitialData(viewId);
    String greeting = 'Hello';
    final map = data?.dartify() as Map<Object?, Object?>?;
    if (map != null && map['greeting'] is String) {
      greeting = map['greeting'] as String;
    }

    return const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(child: Text('')), // on remplace juste après:
    );
  }
}

void main() {
  runWidget(const MyWidget()); // requis en multi-view (pas d’implicitView)
}

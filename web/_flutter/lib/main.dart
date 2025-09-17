import 'dart:js_interop' as js;
import 'dart:ui_web' as ui_web;

import 'package:flutter/widgets.dart';

import 'multi_view_app.dart';
import 'src/widget_view.dart';

class WidgetMapper extends StatelessWidget {
  const WidgetMapper({super.key});

  @override
  Widget build(BuildContext context) {
    final viewId = View.of(context).viewId;
    final js.JSAny? data = ui_web.views.getInitialData(viewId);
    final map = data?.dartify() as Map<Object?, Object?>?;
    final Map<Object?, Object?> viewData = (map == null) ? {} : map;

    return Container(
      color: const Color(0xFFFFFFFF),
      child: WidgetView(initialData: viewData),
    );
  }
}

void main() {
  runWidget(
    MultiViewApp(
      viewBuilder: (context) => Directionality(
        textDirection: TextDirection.ltr,
        child: const WidgetMapper(),
      ),
    ),
  );
}

#!make

.PHONY: build
build:
	@{ \
  		result=""; \
  		(flutter pub get && flutter analyze --no-fatal-warnings) || result="$$result \n - Flutter analysis: ❌"; \
  		(cd package && flutter test) || result="$$result \n - Flutter package: ❌"; \
		(cd web/_flutter && flutter build web --pwa-strategy=none) || result="$$result \n - Flutter web: ❌"; \
		(cp -r web/_flutter/build/web/* web/react-lib/flutter/ && cd web/react-lib && npm install && npm run build) || result="$$result \n - ReactJS lib: ❌"; \
		(cp -r web/_flutter/build/web/* web/vue-lib/flutter/ && cd web/vue-lib && npm install && npm run build) || result="$$result \n - VueJS lib: ❌"; \
		if [ "$$result" == "" ]; then echo "All good! ✅"; else echo "Some errors:$$result"; exit 1; fi; \
	}

#!make

.PHONY: build
build:
	@{ \
  		result=""; \
  		(flutter clean && rm -rf web/react-lib/flutter && rm -rf web/vue-lib/flutter && rm -rf web/react-lib/dist && rm -rf web/vue-lib/dist && rm -rf web/react-lib/node_modules && rm -rf web/vue-lib/node_modules && rm -rf web/react-lib/package-lock.json && rm -rf web/vue-lib/package-lock.json) || result="$$result \n - Clean: ❌"; \
  		(flutter pub get && flutter analyze --no-fatal-warnings) || result="$$result \n - Flutter analysis: ❌"; \
  		(cd package && flutter test) || result="$$result \n - Flutter package: ❌"; \
		(cd web/_flutter && flutter build web --debug --pwa-strategy=none && mv build/web/index.html build/web/bootstrap.js) || result="$$result \n - Flutter web: ❌"; \
		(mkdir -p web/react-lib/flutter && cp -r web/_flutter/build/web/* web/react-lib/flutter/ && cd web/react-lib && npm install && npm run build) || result="$$result \n - ReactJS lib: ❌"; \
		(mkdir -p web/vue-lib/flutter && cp -r web/_flutter/build/web/* web/vue-lib/flutter/ && cd web/vue-lib && npm install && npm run build) || result="$$result \n - VueJS lib: ❌"; \
		if [ "$$result" == "" ]; then echo "Build successful! ✅"; else echo "Some errors:$$result"; exit 1; fi; \
	}

.PHONY: publish
publish:
	@make build
	@{ \
		(cd web/react-lib && npm publish) || result="$$result \n - ReactJS lib: ❌"; \
		(cd web/vue-lib && npm publish) || result="$$result \n - VueJS lib: ❌"; \
		if [ "$$result" == "" ]; then echo "Publish successful! ✅"; else echo "Some errors:$$result"; exit 1; fi; \
	}

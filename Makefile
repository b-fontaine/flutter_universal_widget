#!make

.PHONY: build
build:
	@{ \
  		$result="Build finished :"; \
  		(flutter pub get && flutter analyze && result+="$errors \n - Flutter analysis: ✅") || result+="$errors \n - Flutter analysis: ❌"; \
  		(cd package && flutter test && result+="$errors \n - Flutter package: ✅") || result+="$errors \n - Flutter package: ❌"; \
		(cd web/_flutter && flutter build web --pwa-strategy=none && result+="$errors \n - Flutter web: ✅") || result+="$errors \n - Flutter web: ❌"; \
	}

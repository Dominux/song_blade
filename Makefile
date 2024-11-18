run:
	python3 -m http.server

download_libs:
	wget https://cdn.babylonjs.com/babylon.js -O ./lib/babylon.js

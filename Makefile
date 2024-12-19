run:
	python3 -m http.server

download_libs:
	wget https://cdn.babylonjs.com/babylon.js -O ./lib/babylon.js
	wget https://cdn.babylonjs.com/havok/HavokPhysics_umd.js -O ./lib/havok.js
	wget https://github.com/BabylonJS/havok/raw/refs/heads/main/packages/havok/lib/esm/HavokPhysics.wasm -O ./lib/HavokPhysics.wasm

publish:
	git branch -D gh_pages || true
	git checkout -b gh_pages
	make download_libs
	rm .gitignore README.md lib/.gitkeep
	git add -A
	git commit -m "Published"
	git push --set-upstream origin gh_pages -f
	git checkout -

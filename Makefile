clean:
	rm -rf dist
	rm -rf node_modules

install:
	npm i
	cp -n .env.example .env || true

build:
	npm run build

init:
	make clean
	make install
	make build

rebuild:
	make init

build-docker:
	docker build -t mc.graphql-gateway .

rebuild-docker:
	@docker rmi gateway || true
	make build-docker

run-docker:
	docker run -p 50050:50500 -d --name gateway mc.graphql-gateway

stop-docker:
	@docker stop gateway || true
	@docker rm gateway || true

rebuild-contract:
	(cd ../../contracts/microcore && ppm generate --pack typescript)
	make generate
	npm install ../../contracts/microcore/dist/dist
	make build

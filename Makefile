TEST_LOCAL_ENV=\
	NODE_ENV=test \
	SERVER_PORT=3000 \
	FIREBASE_CONFIG_FILE=../../firebase.dev.json \
	DB_HOST=localhost \
	DB_PORT=3306 \
	DB_USERNAME=node_typescript \
	DB_PASSWORD=123@abc \
	DB_DATABASE=node_typescript_dev

DEV_ENV=\
	NODE_ENV=development \
	SERVER_PORT=3007 \
	DB_HOST=t6-db-test.coqugmusftcx.us-west-2.rds.amazonaws.com \
	DB_PORT=3306 \
	DB_USER=admint6 \
	DB_PASSWORD=Sf3vdQJ82L8b \
	DB_DATABASE=wam \
	COGNITO_ENDPOINT=https://cognito-idp.us-east-1.amazonaws.com \
	COGNITO_USERPOOLID=us-west-2_2znmAzRDk \
	COGNITO_CLIENTID=7icr2k86fam7b8ip3pj88tah42 \
	COGNITO_CONFIGFILE=../../../common/config/jwks-development.json \
	COGNITO_REGION=us-west-2 \
	COGNITO_CLIENTSECRET=k8hrs9sliobhvlvp664l3uflili0ucpgmoormb8p2q6316aut8s \
	AWS_ACCESS_KEY_ID=AKIA4SXDJEBYDQI5JQGP \
	AWS_SECRET_ACCESS_KEY=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 \
	REDIS_ENDPOINT=localhost \
	REDIS_PORT=6379 \
	API_ENDPOINT=http://localhost:3007 \
	S3_BUCKET=dev-talosix-images \
	S3_REGION=us-west-2

build:
	npm run build

start.dev:
	npm run build && $(DEV_ENV) \
	node dist/apps/api/index.js

run.staging:
	docker-compose -f docker-compose.staging.yml up

run.test:
	docker-compose -f docker-compose.test.yml up

migrate.dev:
	export NODE_ENV=development; npx knex migrate:latest && npx knex seed:run

migrate.staging:
	export NODE_ENV=staging; npx knex migrate:latest && npx knex seed:run

migrate.test:
	export NODE_ENV=test; npx knex migrate:latest && npx knex seed:run

test.all:
	$(TEST_LOCAL_ENV) \
	npx jest --runInBand --detectOpenHandles --forceExit --bail

test.integration:
	$(TEST_LOCAL_ENV) \
	npx jest int\.test --runInBand --detectOpenHandles --forceExit --bail

test.with-pattern:
	$(TEST_LOCAL_ENV) \
	npx jest ${pattern} --runInBand --detectOpenHandles --forceExit --bail

test.unit:
	$(TEST_LOCAL_ENV) \
	npx jest unit

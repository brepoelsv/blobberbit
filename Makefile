MOCHA_PATH=node_modules/.bin/_mocha

test:
	NODE_ENV=test $(MOCHA_PATH) --compilers js:babel-core/register -w -G --reporter spec

test-debug:
	NODE_ENV=test $(MOCHA_PATH) --compilers js:babel-core/register -w -G --reporter spec debug

test-once:
	NODE_ENV=test $(MOCHA_PATH) --compilers js:babel-core/register --reporter spec

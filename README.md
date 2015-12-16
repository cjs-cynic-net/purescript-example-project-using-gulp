
# Example PureScript project using Gulp

This is an example PureScript project that uses Gulp as its build tool.  It is
built to accompany the blog post [here]().

## Installing necessary build tools.

In order to play around with this code, you need to install [`node` and
`npm`](https://nodejs.org/en/download/package-manager/).

After installing `npm`, run the following command:

```sh
$ npm install
```

This installs all the dependencies listed in `packages.json` to the
`node_modules/` directory.  This includes the PureScript compiler, Bower, and
Gulp.

Next, use Bower to install required PureScript libraries:

```sh
$ node_modules/.bin/bower install
```

This reads the dependencies from `bower.json` and installs them to the
`bower_components/` directory.

## Building the code

This code can be built with Gulp:

```sh
$ node_modules/.bin/gulp build
```

This command puts the compiled JavaScript files in the `site/js/` directory.

## Running tests

```sh
$ node_modules/.bin/gulp test
```

## Looking at the code in a browser

Try running the following command and opening up [`site/index.html`](http://localhost:1337/) in a browser:

```sh
$ node_modules/.bin/gulp server
```

"use strict";

var gulp = require("gulp"),
    connect = require("gulp-connect"),
    purescript = require("gulp-purescript"),
    rimraf = require("rimraf"),
    run = require("gulp-run"),
    webpack = require("webpack-stream");

// purescript sources
var sources = [
  "src/**/*.purs",
  "bower_components/purescript-*/src/**/*.purs",
];

// javascript sources
var foreigns = [
  "src/**/*.js",
  "bower_components/purescript-*/src/**/*.js"
];

// Build the purescript sources and put resultant javascript files into output/.
gulp.task("make", function() {
  return purescript.psc({
    src: sources,
    ffi: foreigns
  });
});

// Build the purescript sources and put resultant javascript files into output/.
gulp.task("make-test", function() {
  return purescript.psc({
    src: sources.concat(["test/**/*.purs"]),
    ffi: foreigns.concat(["test/**/*.js"])
  });
});

// Delete output/, .tmp/, and all .js files under site/js/.
gulp.task("clean", function () {
  ["output", ".tmp", "site/js/**/*.js"].forEach(function (path) {
    rimraf.sync(path);
  });
});

// Create a task that takes the javascript files in output/ from the "make"
// task, and bundles them into a single javascript file to be used by my
// application.
var mkBundleTask = function (name, main) {

  gulp.task("prebundle-" + name, ["make"], function() {
    return purescript.pscBundle({
      src: "output/**/*.js",
      output: ".tmp/js/" + name + ".js",
      module: main,
      main: main
    });
  });

  gulp.task("bundle-" + name, ["prebundle-" + name], function () {
    return gulp.src(".tmp/js/" + name + ".js")
      .pipe(webpack({
        resolve: { modulesDirectories: ["node_modules"] },
        output: { filename: name + ".js" }
      }))
      .pipe(gulp.dest("site/js"))
      // If the connect webserver is running, this signals that it should reload.
      //
      // TODO: this connect.reload() should only be called when a file has
      // actually changed.  Currently it runs every time.
      .pipe(connect.reload());
  });

  return "bundle-" + name;
};

// Run test.
gulp.task("test", ["make-test"], function() {
	  return purescript.pscBundle({ src: "output/**/*.js", main: "Test.Main" })
		      .pipe(run("node"));
});

// Create the output js files under site/js/.
gulp.task("build", [
  mkBundleTask("foo", "Foo"),
  mkBundleTask("bar", "Bar"),
]);

// Run the "build" task everytime one of the source files change.
gulp.task("watch", function() {
  return gulp.watch(sources.concat(foreigns), ["build"]);
});

// Run a development server that serves the files under the site/ directory.
gulp.task("dev-server", function() {
  connect.server({
    port: 1337,
    livereload: { port: 1338 },
    root: "site"
  });
});

// Do both the "dev-server" task and the "watch" task.
gulp.task("server", ["build", "watch", "dev-server"]);

gulp.task("default", ["build"]);

let gulp = require('gulp'),
	sass = require('gulp-sass'),
	csso = require('gulp-csso'),
	notify = require('gulp-notify'),
	babel = require("gulp-babel"),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	htmlmin = require('gulp-html-minifier'),
	sassLint = require('gulp-sass-lint'),
	browserSync = require('browser-sync').create();

gulp.task('lint', function () {
	return gulp.src('src/assets/scss/**/*.s+(a|c)ss')
	.pipe(sassLint())
	.pipe(sassLint.format())
	.pipe(sassLint.failOnError())
});

gulp.task('minify', function () {
	return gulp.src('src/pages/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
	return gulp.src('src/assets/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass())
	.on("error", notify.onError({
		message: "Error: <%= error.message %>",
		title: "Error running something"
	}))
	.pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(csso())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('build/css'))
});

gulp.task("script", function () {
	return gulp.src("src/assets/script/main.js")
	.pipe(babel())
	.pipe(uglify())
	.pipe(gulp.dest("build/script"));
});

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: "./build"
		}
	});
	browserSync.watch('build', browserSync.reload)
});

gulp.task('watch', function () {
	gulp.watch('src/pages/*.html', gulp.series('minify'));
	gulp.watch('src/assets/scss/main.scss', gulp.series('sass', 'lint'));
	gulp.watch('src/assets/script/*.js', gulp.series('script'));
});

gulp.task('default', gulp.series(
	gulp.parallel('sass', 'lint', 'minify', 'script'),
	gulp.parallel('watch', 'serve')
));
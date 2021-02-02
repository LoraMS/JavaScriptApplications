const gulp = require('gulp');
const gulpsync = require("gulp-sync")(gulp);
const clean = require('gulp-clean');
const less = require('gulp-less');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require("browser-sync").create();
const shell = require('gulp-shell');

const dir = {
    src: 'src/',
    public: 'public/'
};

function cleaning() {

    return del([dir.public]);

}
exports.clean = cleaning;
exports.wipe = cleaning;


// compile
function compileless () {
    return gulp.src('./styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/styles'));
}

function compilejs () {
    return gulp.src('./scripts/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./public/scripts'));
}

exports.compile = gulp.series(compileless, compilejs);

// gulp watch
function watch() {
    gulp.watch('./styles/*.less', compileless);
    gulp.watch('./scripts/**/*', compilejs);
}

exports.watch = watch;

// copy 
function images() {
    return gulp.src('./images/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest('./public/images'));
}

function fonts() {
    return gulp.src('./fonts/*')
        .pipe(gulp.dest('./public/fonts'));
}

function templates() {
    return gulp.src('./templates/*.handlebars')
        .pipe(gulp.dest('./public/templates'));
}

function html() {
    return gulp.src('./*.html')
        .pipe(gulp.dest('./public'));
}

function js() {
    return gulp.src('./*.js')
        .pipe(gulp.dest('./public'));
}

exports.copy = gulp.series(html, templates, fonts, images, js);

// uglify
function uglifyjs() {
    del.sync(['./public/js/min/min.js']);
    return gulp.src([
        './public/*.js', 
        './public/scripts/controllers/*.js',
        './public/scripts/requests/*js',
        './public/scripts/utils/*js'])
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./public/scripts'));
}

function uglifystyle() {
    return gulp.src("./styles/*.css")
    .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
    }))
    .pipe(gulp.dest("./public/styles"));
}

exports.uglifyed = gulp.series(uglifystyle, uglifyjs);

//start
function server() {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });
}

exports.server = server;

// build
exports.build = gulp.series(exports.clean, exports.compile, exports.uglifyed, exports.copy); 

//node_modules
// dev
exports.dev = gulp.series(exports.build, exports.server); 

// deploy
gulp.task('deploy', shell.task([
    'firebase deploy'
]));
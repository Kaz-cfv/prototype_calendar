/**
* gulpfile.js is CREBER FLAVOR. for develop
**/

var config = {};
config.paths = {
  root: "./",

  //ソース元
  src: "./resources/",

  //生成先
  dest: "./public_html/",

  //ブラウザの初期パス
  startPath: "/",

  //ドキュメントルート
  wwwroot: "./public_html/",

  getSrc: function () {
    return this.src;
  },
  geDest: function () {
    return this.dest;
  },
  getWWWRoot: function () {
    return this.wwwroot;
  },
}

//destのクリーンアップ
config.clean ={
  enable: false,
  dest:[
    config.paths.geDest() + '**/*',
    '!' + config.paths.geDest() + '\.*'
  ]
}

config.paths.statics = [
  'html', 'htm', //html
  'css', 'inc', 'xml', 'json', //sources
  'zip', 'pdf', //binary
  'webp', 'apng', 'ani.png', 'avif', //image
  'mp3', //music
  'mp4', 'webm',//movie
  'woff', 'woff2', 'eot', 'otf', 'ttf', //webfonts
  'map', 'txt',
  'php',
  'ico'
];

config.public = {
  enable: true,
  src: [
    config.paths.getSrc() + 'public/**/*.+(' + config.paths.statics.join('|') + ')',
    config.paths.getSrc() + 'public/**/.*',
    '!' + config.paths.getSrc() + 'public/**/_*',
    '!' + config.paths.getSrc() + 'public/**/_*/*'
  ],
  dest: config.paths.geDest() + '',
  observe: [
    config.paths.getSrc() + 'public/**/*.(' + config.paths.statics.join('|') + ')',
    config.paths.getSrc() + 'public/**/.*',
    '!' + config.paths.getSrc() + 'public/**/_*',
    '!' + config.paths.getSrc() + 'public/**/_*/*'
  ]
}

config.pug = {
  enable: true,
  src: [config.paths.getSrc() + 'public/**/*.pug', '!'+config.paths.getSrc() + '/public/**/_*.pug'],
  dest: config.paths.geDest() + '',
  observe: [config.paths.getSrc() + 'public/**/*.pug', '!'+config.paths.getSrc() + '/public/**/_*.pug', config.paths.getSrc() + '/assets/pug/**/*.pug']
}

config.image = {
  enable: true,
  src: [config.paths.getSrc() + 'public/**/*.+(jpg|jpeg|png|gif|svg)','!'+config.paths.getSrc() + '/public/**/*.ani.png'],
  dest: config.paths.geDest() + '',
}

config.scss = {
  enable: true,
  isSourcemaps: true,
  src: [config.paths.getSrc() + 'assets/scss/**/*.scss'],
  dest: config.paths.geDest() + 'common/css/',
}

config.js = {
  enable: true,
  isSourcemaps: true,
  src: [config.paths.getSrc() + 'assets/js/**/*.js',
   '!' + config.paths.getSrc() + 'assets/js/_**/*.js',
   '!' + config.paths.getSrc() + 'assets/js/**/vendor.js'
  ],
  dest: config.paths.geDest() + 'common/js/',
  observe: [
    config.paths.getSrc() + 'assets/js/**/*.js',
    '!' + config.paths.getSrc() + 'assets/js/**/vendor.js'
  ],
}

config.js_vendor = {
  enable: true,
  src: [config.paths.getSrc() + 'assets/js/**/vendor.js'],
  dest: config.paths.geDest() + 'common/js/',
  observe: config.paths.getSrc() + 'assets/js/**/vendor.js',
}

/**
* dependencies modules
**/
const gulp = require('gulp');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const cache  = require('gulp-cached');

// //html
const pug = require('gulp-pug');

// //css
// const sass    = require('gulp-sass');
// sass.compiler = require('node-sass'); //コンパイラを明記
const sass = require('gulp-sass')(require('node-sass'));
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');

// //image
const imagemin = require('gulp-imagemin');

// //js
const babel = require('gulp-babel');
const include = require('gulp-include');

//misc
const replace = require("gulp-replace");
const rename = require("gulp-rename");

// //Browser
// const browserSync = require('browser-sync');
const browserSync = require('browser-sync').create();
// const connectSSI  = require('connect-ssi');
const browserStream = () => browserSync.stream();

// //Utility
let websiteConfig = require("./.website.config");
// const path = require('path');
// const del = require('del');
// const fs = require('fs');
// const argv = require('yargs').argv;

//functions
const creflalogo = done => {
  console.info('    ___  ____  \n   / _/ /__  \\ \n  / / ____/  /  ____  ____  _  _  \n / / /___   /  (  _ \\( ___)( \\/ ) \n/ /____  / /    )(_) ))__)  \\  /  \n\\_____/ /_/    (____/(____)  \\/ \n');
  done();
}

/**
* ディレクトリを削除
**/
gulp.task('clean', function() {
  return config.clean.enable ? del(config.clean.dest, {force:true}) : true;
});

/**
* 静的ファイルコピー
**/
function buildStatic(){
  return gulp.src(config.public.src)
  .pipe(cache(buildStatic))
  .pipe(gulp.dest(config.public.dest));
}

/****
 * pug
 */
function buildPug() {
  return gulp.src(config.pug.src)
  .pipe(plumber({
    errorHandler: function(err) {
      console.error(err);
      this.emit('end');
    }
  }))
  .pipe(pug({
    basedir: __dirname + '/resources/assets/pug',
    pretty: true,
    data: websiteConfig
  }))
  .pipe(gulp.dest(config.pug.dest))
  .pipe(browserStream())
}

/**
* sass
**/
function buildSass() {
  var postcssOpt = [
    require('postcss-import'),
    require('postcss-gap-properties'),
    require('autoprefixer')({
        grid: true
      }),
    require('postcss-custom-media'),
    require('css-mqpacker'),
  ];

  //start compile
  return gulp.src(config.scss.src, {sourcemaps: config.scss.isSourcemaps})
  .pipe(plumber({
    errorHandler: function(err) {
      console.error(err);
      this.emit('end');
    }
  }))
  .pipe(sassGlob())
  .pipe(sass())
  .pipe(postcss(postcssOpt))
  .pipe(gulp.dest(config.scss.dest,{ sourcemaps: '../../_cache/_maps/' }))
  .pipe(browserStream())
}

/**
* images
**/
function buildImage() {

  return gulp.src(config.image.src)
  .pipe(plumber({
    errorHandler: function(err) {
      console.error(err);
      this.emit('end');
    }
  }))
  .pipe(cache(buildImage))
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
  ]))
  .pipe(gulp.dest( config.image.dest ));
}

function buildJs() {
  return gulp.src(config.js.src, {sourcemaps: config.js.isSourcemaps})
  .pipe(plumber({
    errorHandler: function(err) {
      console.error(err);
      this.emit('end');
    }
  }))
  .pipe(include({
    hardFail: false,
    includePaths: [
      __dirname + "/node_modules",
      config.paths.getSrc() + '/assets/js'
    ]
    }))
  .pipe(babel())
  .pipe(gulp.dest(config.js.dest, { sourcemaps: '../../_cache/_maps/' }));
}

function buildJsVendor(){
  return gulp.src(config.js_vendor.src)
    .pipe(plumber({
      errorHandler: function(err) {
        console.error(err);
        this.emit('end');
      }
    }))
    .pipe(include({
      hardFail: false,
      includePaths: [
        __dirname + "/node_modules",
        config.paths.getSrc() + '/assets/js'
      ]
      }))
    .pipe(gulp.dest(config.js_vendor.dest))
}


function buildwp() {

    const pugAssetPath = [config.paths.getSrc() + 'assets/pug/**/*.pug', '!'+config.paths.getSrc() + '/assets/pug/**/_*.pug'];
    const dist = __dirname + '/dist-wp/';

    //elementsを変換
    gulp.src(pugAssetPath)
    .pipe(plumber({
      errorHandler: function(err) {
        console.error(err);
        this.emit('end');
      }
    }))
    .pipe(replace(/( +)include \/(elements\/.+)/g, '$1<?php get_template_part("$2") ?>'))
    .pipe(pug({
      basedir: config.paths.getSrc() + '/assets/pug',
      pretty: true,
      data: websiteConfig
    }))
    .pipe(replace(/"\.\.?\/common/, '"/common'))
    .pipe(replace(/(srcset|src|href)="\/common\/([A-Za-z0-9_\-\.\/]+)"/g, '$1="<?= get_template_directory_uri(); ?>/common/$2"'))
    .pipe(replace(/url\(.*\/common\/(.+)\)/g, 'url(<?= get_template_directory_uri(); ?>/common/$1)'))
    .pipe(rename(function (path) {
      return {
        dirname: path.dirname,
        basename: path.basename,
        extname: ".php"
      };
    }))
    .pipe(gulp.dest(dist))

    //本体を変換
    return CompileBody = gulp.src(config.pug.src)
      .pipe(plumber({
        errorHandler: function(err) {
          console.error(err);
          this.emit('end');
        }
      }))
      .pipe(replace(/( +)include \/(elements\/.+)/g, '$1<?php get_template_part("$2") ?>'))
      .pipe(pug({
        basedir: __dirname + '/resources/assets/pug',
        pretty: true,
        data: websiteConfig
      }))
      .pipe(replace(/"\.\.?\/common/, '"/common'))
      .pipe(replace(/(srcset|src|href)="\/common\/([A-Za-z0-9_\-\.\/]+)"/g, '$1="<?= get_template_directory_uri(); ?>/common/$2"'))
      .pipe(replace(/url\(.*\/common\/(.+)\)/g, 'url(<?= get_template_directory_uri(); ?>/common/$1)'))
      .pipe(rename(function (path) {
        let dirname = path.dirname;
        let filename = path.dirname.replace(/(\\|\/)/g,"__");
        if (path.dirname === '.') {
          filename = 'home';
        }
        return {
          dirname: '',
          basename: 'page-' + filename,
          extname: ".php"
        };
      }))
      .pipe(gulp.dest(dist))
}

function startBrowserSync(done) {
  const Opt_browserSync = {
    startPath: config.paths.startPath,
    server: {
      baseDir: config.paths.getWWWRoot(),
    },
    open : 'external',
    reloadOnRestart: true
  };
  browserSync.init(Opt_browserSync);
  done();
}

function watchBuild(done) {

  const browserReload = (done) => {
    browserSync.reload();
      done();
    };

  const watchStart = () => {
    // sass
    gulp.watch(config.scss.src)
      .on('add',gulp.series(buildSass))
      .on('change',gulp.series(buildSass))
      .on('unlink', gulp.series(buildSass));
    // pug
    gulp.watch(config.pug.observe)
      .on('add',gulp.series(buildPug))
      .on('change',gulp.series(buildPug));
    // static
    gulp.watch(config.public.observe)
      .on('add', gulp.series(buildStatic, browserReload))
      .on('change', gulp.series(buildStatic, browserReload));
    // image
    gulp.watch(config.image.src)
      .on('add', gulp.series(buildImage, browserReload))
      .on('change', gulp.series(buildImage, browserReload));
    // js
    gulp.watch(config.js.observe)
      .on('add',  gulp.series(buildJs, browserReload))
      .on('change',  gulp.series(buildJs, browserReload))
      .on('unlink',  gulp.series(buildJs, browserReload));
    // js_vendor
    gulp.watch(config.js_vendor.observe)
      .on('add', gulp.series(buildJsVendor, browserReload))
      .on('change', gulp.series(buildJsVendor, browserReload))
      .on('unlink', gulp.series(buildJsVendor, browserReload));

      //
      setTimeout(function() {
        console.info('[Gulp] coding ready.');
      },500);

    done();
  };
  setTimeout(watchStart,1500); // wait for browserSync
}

gulp.task('default', gulp.task('watch'));
gulp.task('watch', gulp.series(creflalogo, gulp.parallel(buildSass, buildPug, buildJs, buildJsVendor, buildStatic, buildImage), gulp.series(startBrowserSync, watchBuild)));

gulp.task('build', gulp.series(gulp.parallel(buildStatic, buildSass, buildPug, buildJs, buildJsVendor, buildStatic, buildImage)));
gulp.task('build:static', buildStatic);
gulp.task('build:sass', buildSass);
gulp.task('build:pug', buildPug);
gulp.task('build:image', buildImage);
gulp.task('build:js', gulp.parallel(buildJs, buildJsVendor));
gulp.task('build:wp', buildwp);

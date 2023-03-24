const { src, dest, series, watch, parallel, symlink } = require("gulp");
const fileinclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");

const PATH = {
    HTML: "./workspace/html",
    GUIDE: "./workspace/guide",
    ASSETS: {
      FONTS: "./workspace/assets/fonts",
      IMAGES: "./workspace/assets/img",
      STYLE: "./workspace/assets/scss",
      JS: "./workspace/assets/js",
      LIB: "./workspace/assets/lib",
    },
  },
  DEST_PATH = {
    HTML: "./dist/html",
    GUIDE: "./dist/guide",
    ASSETS: {
      FONTS: "./dist/assets/fonts",
      IMAGES: "./dist/assets/img",
      STYLE: "./dist/assets/css",
      JS: "./dist/assets/js",
      LIB: "./dist/assets/lib",
    },
  };

//tasks.....
function server(cb) {
  console.log("server routed");
  browserSync.init({
    //port: 8000,
    server: {
      baseDir: "./",
    },
  });
}

function clean(done) {
  console.log("clean files excuted");
  return del([
    DEST_PATH.HTML,
    DEST_PATH.GUIDE,
    DEST_PATH.ASSETS.STYLE,
    DEST_PATH.ASSETS.JS,
    DEST_PATH.ASSETS.IMAGES,
    "!dist/assets/fonts/**",
  ]);
  done();
}

function include(done) {
  //console.log('file include excute');
  return src(PATH.HTML + "/*.html")
    .pipe(
      fileinclude({
        context: {
          cssArr: [],
          jsArr: [],
        },
        prefix: "@@",
        basepath: "@file",
        indent: "true",
      })
    )
    .pipe(dest(DEST_PATH.HTML))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
  done();
}
function guide(done) {
  //console.log('file include excute');
  return src(PATH.GUIDE + "/*.html")
    .pipe(
      fileinclude({
        context: {
          cssArr: [],
          jsArr: [],
        },
        prefix: "@@",
        basepath: "workspace/html",
        indent: "true",
      })
    )
    .pipe(dest(DEST_PATH.GUIDE))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
  done();
}

function style(done) {
  console.log("style excute");
  const options = {
    outputStyle: "expanded", //nested, expanded, compact, compressed
    indentType: "space", //space , tab
    indentWidth: 4, //outputStyle 이 nested, expanded 인 경우에 사용
    precision: 8, //컴파일 된 CSS 의 소수점 자리수 : default 5
    sourceComments: true, //컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시
  };
  return src(PATH.ASSETS.STYLE + "/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass.sync(options).on("error", sass.logError))
    .pipe(sourcemaps.write("./map"))
    .pipe(dest(DEST_PATH.ASSETS.STYLE))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
  done();
}

function js(done) {
  console.log("js task excuted !");
  return src(PATH.ASSETS.JS + "/**/*.js")
    .pipe(dest(DEST_PATH.ASSETS.JS))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
  done();
}

function img(done) {
  console.log("img task excuted !");
  return src(PATH.ASSETS.IMAGES + "/**/*")
    .pipe(dest(DEST_PATH.ASSETS.IMAGES))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
  done();
}

function watching(cb) {
  console.log("watch excuted");
  watch([PATH.HTML + "/**/*.html", PATH.GUIDE + "/**/*.html"], include);
  watch([PATH.HTML + "/**/*.html", PATH.GUIDE + "/**/*.html"], guide);
  watch(PATH.ASSETS.STYLE + "/**/*.scss", style);
  watch(PATH.ASSETS.JS + "/**/*.js", js);
  watch(PATH.ASSETS.IMAGES + "/**/*", img);
}

exports.server = server;
exports.clean = clean;
exports.include = include;
exports.guide = guide;
exports.style = style;
exports.js = js;
exports.img = img;
exports.watching = watching;

export const prepare = series([clean]);
export const assets = series([include, guide, style, js, img]);
export const build = series([prepare, assets]);
export const live = parallel([server, watching]);
export const dev = series([build, live]);

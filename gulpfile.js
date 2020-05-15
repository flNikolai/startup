let preprocessor = 'sass', // Препроцессор
  fileswatch = 'html,htm,txt,json,md,woff2', // Список расширений для прослушки
  imageswatch = 'jpg,jpeg,png,webp,svg', // Список для прослушки и сжатия
  fontswatch = 'ttf', // Список для прослушки
  baseDir = 'app', // Базовый путь к каталогу без «/» в конце
  online = true; // Если «false» - Browsersync будет работать в автономном режиме без подключения к интернету

let paths = {

  scripts: {
    src: [
      // 'node_modules/jquery/dist/jquery.min.js', // npm пример (npm i --save-dev jquery)
      baseDir + '/js/app.js' // app.js. Всегда в конце
    ],
    dest: baseDir + '/js',
  },

  styles: {
    src: baseDir + '/' + preprocessor + '/main.*',
    dest: baseDir + '/css',
  },

  images: {
    src: baseDir + '/images/src/**/*',
    dest: baseDir + '/images',
  },

  fonts: {
    src: baseDir + '/fonts/src/**/*',
    dest: baseDir + '/fonts',
  },

  deploy: {
    hostname: 'username@yousite.com',
    destination: 'yousite/public_html/',
    include: [/* '*.htaccess' */],
    exclude: ['**/Thumbs.db', '**/*.DS_Store'],
  },

  cssOutputNameMin: 'app.min.css',
  cssOutputName: 'app.css',
  jsOutputName: 'app.min.js',

}

// Логика

const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const ttf2woff2 = require('gulp-ttf2woff2');
const newer = require('gulp-newer');
const rsync = require('gulp-rsync');
const del = require('del');

function browsersync() {
  browserSync.init({
    server: { baseDir: baseDir + '/' },
    notify: false,
    online: online
  })
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(concat(paths.jsOutputName))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

function styles() {
  return src(paths.styles.src)
    .pipe(eval(preprocessor)())
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(sass({ outputStyle: 'expanded' })) 
    /* nested - показывает вложенность (по умолчанию);
     * expanded - полностью развёрнутый CSS; 
     * compact - каждый селектор на новой строке; 
     * compressed - всё в одну строку.
    */
    .pipe(concat(paths.cssOutputName))
    .pipe(dest(paths.styles.dest))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }, /* формат: 'beautify' */ }))
    .pipe(concat(paths.cssOutputNameMin))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

function fonts() {
  return src(paths.fonts.src)
    .pipe(newer(paths.fonts.dest))
    .pipe(ttf2woff2())
    .pipe(dest(paths.fonts.dest))

}

function images() {
  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(dest(paths.images.dest))
}

function cleanimg() {
  return del('' + paths.images.dest + '/**/*', { force: true })
}

function deploy() {
  return src(baseDir + '/')
    .pipe(rsync({
      root: baseDir + '/',
      hostname: paths.deploy.hostname,
      destination: paths.deploy.destination,
      include: paths.deploy.include,
      exclude: paths.deploy.exclude,
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    }))
}

function startwatch() {
  watch(baseDir + '/**/' + preprocessor + '/**/*', styles);
  watch(baseDir + '/**/*.{' + imageswatch + '}', images);
  watch(baseDir + '/**/*.{' + fontswatch + '}', fonts);
  watch(baseDir + '/**/*.{' + fileswatch + '}').on('change', browserSync.reload);
  watch([baseDir + '/**/*.js', '!' + paths.scripts.dest + '/*.min.js'], scripts);
}

exports.browsersync = browsersync;
exports.assets = series(cleanimg, styles, scripts, images, fonts);
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.cleanimg = cleanimg;
exports.deploy = deploy;
exports.default = parallel(images, fonts, styles, scripts, browsersync, startwatch);
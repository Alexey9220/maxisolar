"use strict";

var config = {
    server: {
        baseDir: './template'
    },
    host: 'localhost',
    open: 'external',
    port: 3000,
    logPrefix: "server"
};

var path = {
    template: {
        html: 'template/',
        js: 'template/js/',
        jsmain: 'template/js',
        css: 'template/css/',
        img: 'template/images/',
        fonts: 'template/fonts/',
        favicon: 'template/favicon/',
        smarty: 'smarty/'
    },
    app: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        jsmain: 'app/js/main.js',
        scss: 'app/css/main.scss',
        css: 'app/css/*.css',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
        favicon: 'app/favicon/**/*.*',
        smarty: 'app/template/*.html'
    },
    watch: {
        html: 'app/*.html',
        htmlTemplate: 'app/template/*.html',
        js: 'app/js/*.js',
        jsmain: 'app/js/main.js',
        scss: 'app/css/*.scss',
        css: 'app/css/*.css',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
        favicon: 'app/favicon/**/*.*'
    },
    clean: './template/'
};

var gulp = require("gulp"),
    browserSync = require('browser-sync').create(), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    autoprefixer = require('gulp-autoprefixer'), // плагин для autoprefixer
    del = require('del'); // плагин для удаления файлов и каталогов

// запуск сервера
gulp.task('browserSync', function(done) {
    browserSync.init(config);
    done();
});

// подключение wow.js - animate.css
gulp.task('animatecss:build', function() {
    return gulp.src('./node_modules/wow.js/css/libs/animate.css')
    .pipe(gulp.dest('./app/css/'));
});

// подключение wow.js - wow.js
gulp.task('wowjs:build', function() {
    return gulp.src('./node_modules/wow.js/dist/wow.js')
    .pipe(gulp.dest('./app/js/'));
});

// сбор html
gulp.task('html:build', function(done) {
    gulp.src(path.app.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.template.html)) // выкладывание готовых файлов
        .pipe(browserSync.reload({ stream: true })); // перезагрузка сервера
    done();
});

// сбор css
gulp.task('scss:build', function(done) {
    gulp.src(path.app.scss) // получим main.scss  
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass({
            includePaths: ['node_modules/wow.js/css/libs/'],
            //outputStyle: 'nested'
			outputStyle: 'expanded'
			//outputStyle: 'compact'
			//outputStyle: 'compressed'
        }).on('error', sass.logError)) // scss -> css
		
		.pipe(autoprefixer({
			browers: ['last 10 versions'], 		
			//overrideBrowserslist: ['last 5 versions'], 		
			cascade: false
		}))
		
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.template.css)) // выгружаем в template
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
    done();
});

gulp.task('css:build', function(done) {
    gulp.src(path.app.css)
        .pipe(gulp.dest(path.template.css)); // Переносим скрипты в продакшен
    done();
});

// сбор js
gulp.task('jsmain:build', function(done) {
    gulp.src(path.app.jsmain) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(uglify()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.template.jsmain)) // положим готовый файл
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
    done();
});

gulp.task('js:build', function(done) {
    gulp.src([path.app.js, '!app/js/main.js'])
        .pipe(gulp.dest(path.template.js)); // Переносим скрипты в продакшен
    done();
});

// перенос шрифтов
gulp.task('fonts:build', function(done) {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.template.fonts));
    done();
});

// html в папку smarty
gulp.task('smarty:build',function(done){
    return gulp.src([
      path.app.smarty,
      './app/index.html'
      ]).pipe(gulp.dest(path.template.smarty));

      /* игнорирование файлов */
      //gulp.src(destPath + 'components/**/*.css', {dot: true, ignore: '/**/*.min.css'})

    done();
});

// перенос favicon
gulp.task('favicon:build', function(done) {
    gulp.src(path.app.favicon)
        .pipe(gulp.dest(path.template.favicon));
    done();
});

// обработка картинок
gulp.task('image:build', function(done) {
    gulp.src(path.app.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.template.img)); // выгрузка готовых файлов
    done();
});

// удаление каталога template
gulp.task('clean:build', function(done) {
    del.sync(path.clean);
    done();
});

// очистка кэша
gulp.task('cache:clear', function(done) {
    cache.clearAll();
    done();
});

// сборка
gulp.task('build', gulp.series(
    'clean:build', 
    'html:build', 
    'scss:build', 
    'css:build', 
    'js:build', 
    'jsmain:build', 
    'fonts:build', 
    'favicon:build', 
    //'smarty:build',
    'image:build', function(done) {
        done();
    }));

// запуск задач при изменении файлов
gulp.task('watch', function() {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.htmlTemplate, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.scss, gulp.series('scss:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
    gulp.watch(path.watch.favicon, gulp.series('favicon:build'));
    //gulp.watch(path.watch.favicon, gulp.series('smarty:build'));
    gulp.watch(path.watch.jsmain, gulp.series('jsmain:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series('clean:build', 'build', gulp.parallel('browserSync', 'watch')));
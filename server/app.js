var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser'); // Body 데이터를 분석(parse)해서 req.body로 출력해주는 것

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var videoRouter = require('./routes/video');
var subscribeRouter = require('./routes/subscribe');
var commentRouter = require('./routes/comment');
var likeRouter = require('./routes/like');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// aplication/json
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/video', videoRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/api/comment', commentRouter);
app.use('/api/like', likeRouter);
app.use('/uploads', express.static('uploads'));

module.exports = app;

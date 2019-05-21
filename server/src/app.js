var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')

var authRouter = require('./routes/authentication')
var userRouter = require('./routes/user')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.get('/', function (req, res, next) {
  res.status(200).send('The server is up! Please hit one of the API endpoints to use the server')
})

app.use('/authentication', authRouter)
app.use('/user', userRouter)

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.error(err)
  res.status(err.status || 500).send()
})

module.exports = app

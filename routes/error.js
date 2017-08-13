// catch 404 and forward to error handler
var not_found = function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
};

// error handler
var error = function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};

module.exports.not_found = not_found;
module.exports.error = error;
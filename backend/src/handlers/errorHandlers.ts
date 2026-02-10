export const catchErrors = (fn: any) => {
  return function (req: any, res: any, next: any) {
    return fn(req, res, next).catch((error: any) => {
      if (error.name == 'ValidationError') {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Required fields are not supplied',
          controller: fn.name,
          error: error,
        });
      } else {
        // Server Error
        return res.status(500).json({
          success: false,
          result: null,
          message: error.message,
          controller: fn.name,
          error: error,
        });
      }
    });
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const notFound = (req: any, res: any, next: any) => {
  return res.status(404).json({
    success: false,
    message: "Api url doesn't exist ",
  });
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
 export const developmentErrors = (error: any, req: any, res: any, next: any) => {
  error.stack = error.stack || '';
  const errorDetails = {
    message: error.message,
    status: error.status,
    stackHighlighted: error.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };

  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};

/*
  Production Error Handler

  No stacktraces are leaked to admin
*/
export const productionErrors = (error: any, req: any, res: any, next: any) => {
  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};

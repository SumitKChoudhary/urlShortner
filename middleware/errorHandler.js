
module.exports = (error, req, res, next) => {
    console.error(error); 
    const status = error.statusCode || 500;
    const message = error.message || 'An unexpected error occurred.';
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  };
  
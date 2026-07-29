const errorHandler = (err, req, res, nex) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).render("error", {
    status,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorHandler;

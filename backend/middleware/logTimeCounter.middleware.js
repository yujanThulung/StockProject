const logTimeCounter= ((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ⏱️ ${duration}ms`);
    });
    next();
  });
  

  export default logTimeCounter;
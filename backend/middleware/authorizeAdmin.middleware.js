export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden - Admin access required',
    });
  }
  next();
};

export default authorizeAdmin;

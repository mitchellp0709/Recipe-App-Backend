const jwt= require("jsonwebtoken");



module.exports=(req, res, next)=> {
  const authHeader = req.get('Authorization');
  if (authHeader == undefined) {
    req.isAuth = false;
    return next()
  }
  const token = authHeader.split(' ')[1];  //bearer [token value] ===>[token value]
  if (token == undefined || token === "") {
    req.isAuth = false;
    return next();
  }
  let decToken;
  try {
  decToken=jwt.verify(token, 'IROH');
  } catch (error) {
    req.isAuth = false
    return next();
  }
  if (decToken === undefined) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decToken;
  next();
}
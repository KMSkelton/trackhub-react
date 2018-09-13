export default function authCheck(noAuthHandler, handler) {
  return function(req, res, next) {
    const hasDisplayName = req.session.displayName || false
    const hasEmail = req.session.email || false

    hasEmail && hasDisplayName ? handler(req, res, next) : noAuthHandler(req,res,next)
  }
}
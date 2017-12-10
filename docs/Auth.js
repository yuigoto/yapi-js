/**
 * @apiDefine AuthParam
 * @apiParam {String} user Your username
 * @apiParam {String} email Your e-mail address
 * @apiParam {String} pass Your password
 */

/**
 * @api {POST} /auth Auth
 * 
 * @apiName Auth
 * @apiDescription 
 *    Authentication endpoint, receives a combination of username/e-mail 
 *    address and password, returns a token if valid.
 * 
 *    You cannot, and should not, use both e-mail/user in the same request.
 * @apiGroup AUTH
 * 
 * @apiUse AuthParam
 * 
 * @apiSuccess {String} token 
 *    A user token, containing credentials, as a JSON Web Token string
 * 
 * @apiError (401) {Object} error
 *    Object containing information about the error, stack trace and 
 *    descriptions
 */

/**
 * @api {POST} /auth/validate AuthValidate
 * 
 * @apiName AuthValidate 
 * @apiDescription 
 *    Validates a JSON Web Token returned by the `/auth` endpoint, checks if 
 *    it's still valid and returns the token's credentials.
 * 
 *    If not valid, returns an error object.
 * 
 *    Do **NOT** use this endpoint to check for public tokens (non-auth), 
 *    since they **always** return as a valid token, even though you can't 
 *    use'em to make requests to restricted endpoints.
 * @apiGroup AUTH
 * 
 * @apiParam {String} token 
 *    A JSON Web Token string 
 * 
 * @apiSuccess {Object} person 
 *    An object containing some basic user credentials, mostly for display
 * 
 * @apiError (401) {Object} error
 *    Object containing information about the error, stack trace and 
 *    descriptions
 */

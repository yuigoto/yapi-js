/**
 * YAPI : Routes/API/Auth
 * ======================================================================
 * Routes related to authentication.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Import modules
import express, { Router } from "express";
import crypto_md5 from "crypto-js/md5";

// Import local
import Core from "src/core/Core";
import Response from "src/core/Response";
import Error from "src/core/Error";
import Token from "src/core/Token";
import UUID from "src/core/UUID";

// Import models and model helpers
import User, { UserDisplayName } from "src/models/User.model";
import AuthToken from "src/models/AuthToken.model";

// Start router
const Routes = Router();

// No get access to this route
Routes.get("/", (req, res) => {
  res.status(403).send(
    Response(
      "NULL",
      {},
      "Access to this endpoint was denied.",
      Error(
        403,
        {},
        "Forbidden",
        "Access to this endpoint was denied."
      ),
      {}
    )
  );
});

// Login data
Routes.post("/", (req, res) => {
  // Request body
  let { user, email, pass } = req.body;

  // User sent nothing or sent only the password
  if (!user && !email && !pass || !user && !email && pass) {
    res.set({
      "WWW-Authenticate": "Basic"
    });

    // We return, to avoid keep sending headers
    return res.status(401).send(
      Response(
        "NULL",
        {},
        "Please, provide a valid username or e-mail address and password.",
        Error(
          401,
          {},
          "Unauthorized",
          "Please, provide a valid username or e-mail address and password."
        ),
        {}
      )
    );
  }

  // User provided both e-mail AND username
  if (user && email) {
    res.set({
      "WWW-Authenticate": "Basic"
    });

    return res.status(401).send(
      Response(
        "NULL",
        {},
        "Use only an e-mail address or username to login, not both.",
        Error(
          401,
          {},
          "Unauthorized",
          "Use only an e-mail address or username to login, not both."
        ),
        {}
      )
    );
  }

  // User did not provide a password
  if (!pass) {
    res.set({
      "WWW-Authenticate": "Basic"
    });

    return res.status(401).send(
      Response(
        "NULL",
        {},
        "Please, provide a password.",
        Error(
          401,
          {},
          "Unauthorized",
          "Please, provide a password."
        ),
        {}
      )
    );
  }

  // User provided a valid e-mail and/or user and a password
  let auth = {};

  // Define if user or e-mail
  if (user) {
    auth.user = user;
  } else if (email) {
    auth.email = email;
  } else {
    auth.user = "N0T_V@L!D";
  }

  // Querying user data
  const query = User.findOne(auth);

  query.exec((err, results) => {
    if (err) {
      // Error occurred! :(
      return res.send(
        Response(
          "ERROR",
          {},
          "Database query error, could not request user data.",
          Error(
            500,
            {},
            "Error",
            "Database query error, could not request user data."
          )
        )
      );
    } else {
      if (
        !results
        || results === null
        || results === undefined
        || results === ""
      ){
        // No user found
        return res.send(
          Response(
            "SUCCESS",
            {},
            "Username/e-mail address not registered in the database."
          )
        );
      } else {
        let user_data = results;
        pass = crypto_md5(pass, Core.security.salt).toString();

        // Is the password valid?
        if (user_data.pass === pass) {
          // Check user's deletion status
          if (user_data.is_delete) {
            return res.status(401).send(
              Response(
                "NULL",
                {},
                "This user account is/was marked for deletion and cannot be recovered.",
                Error(
                  401,
                  {},
                  "Account deleted",
                  "This user account is/was marked for deletion and cannot be recovered."
                ),
                {}
              )
            );
          }

          // Check user's banned status
          if (user_data.is_banned) {
            return res.status(401).send(
              Response(
                "NULL",
                {},
                "User account banned.",
                Error(
                  401,
                  {},
                  "Account banned",
                  "User account banned."
                ),
                {}
              )
            );
          }

          // Check user's blocked by admin status
          if (user_data.is_blocked) {
            return res.status(401).send(
              Response(
                "NULL",
                {},
                "User account blocked by the administrator.",
                Error(
                  401,
                  {},
                  "Account blocked by the admin",
                  "User account blocked by the administrator."
                ),
                {}
              )
            );
          }

          // Check user's locked status
          if (!user_data.is_active) {
            return res.status(401).send(
              Response(
                "NULL",
                {},
                "User account locked, please activate it before logging in.",
                Error(
                  401,
                  {},
                  "Account locked",
                  "User account locked, please activate it before logging in."
                ),
                {}
              )
            );
          }

          // Set token expire limit in seconds from now
          let expires = 60 * 60 * 24;

          // Generate credentials
          let person  = {
            user_id: user_data._id,
            user: user_data.user,
            email: user_data.email,
            roles: user_data.roles,
            groups: user_data.groups,
            generated: new Date(),
            expires: new Date().getTime() + (expires * 1000),
            data: [],
            is_valid: true,
            is_public: false
          };

          // Set display name
          person.display_name = UserDisplayName(user_data.data);

          // Set token UUID
          person.uuid = UUID(
            crypto_md5(
              person.user_id + user + person.expires, Core.security.salt
            ).toString()
          );

          // Tokenize person data
          let token = Token.fromPerson(person, expires);

          // Did we generate a token?
          if (token) {
            // Invalidate previous user tokens before sending a new one
            AuthToken.updateMany(
              {
                user_id: person.user_id
              },
              {
                is_valid: false
              },
              (err, raw) => {
                new AuthToken(person).save((err) => {
                  if (err) {
                    console.log("Could not save token.");
                    console.error(err);
                  }
                });
              }
            );

            // Return JSON with token
            return res.send(
              Response(
                "SUCCESS",
                {
                  token: token
                },
                ""
              )
            );
          }

          // Failure fallback
          return res.status(200).send(
            Response(
              "SUCCESS",
              {},
              "Could not generate and sign user token, please try again."
            )
          );
        }

        // If the password isn't valid
        return res.status(401).send(
          Response(
            "NULL",
            {},
            "Invalid password.",
            Error(
              401,
              {},
              "Unauthorized",
              "Invalid password."
            ),
            {}
          )
        );
      }
    }
  });
});

// Token Validation
Routes.post("/validate", (req, res) => {
  // Fetch token
  let token = req.body.token;

  // Validate the token
  let person = Token.toPerson(token);

  // If token is invalid
  if (person === false) {
    return res.status(401).send(
      Response(
        "ERROR",
        {},
        "Invalid token provided.",
        Error(
          401,
          {},
          "Invalid Token",
          "Invalid token provided."
        )
      )
    );
  }

  // Return a person object
  return res.send(
    Response(
      "SUCCESS",
      {
        person: person
      },
      ""
    )
  );
});

// No get access to this route
Routes.use(/^\/(.+)/, (req, res) => {
  res.status(403).send(
    Response(
      "NULL",
      {},
      "Endpoint either forbidden and/or non-existent.",
      Error(
        403,
        {},
        "Forbidden",
        "Endpoint either forbidden and/or non-existent."
      ),
      {}
    )
  );
});

// Export routes object
export default Routes;

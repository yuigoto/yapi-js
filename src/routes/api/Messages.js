/**
 * YAPI : Routes/API/Messages
 * ======================================================================
 * Test routes for simple CRUD.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import modules
import { Router } from "express";
import crypto_md5 from "crypto-js/md5";

// Import local
import Core from "src/core/Core";
import Response from "src/core/Response";
import ResponseError from "src/core/ResponseError";
import Token from "src/core/Token";
import UUID from "src/core/UUID";

// Import models and model helpers
import User, { UserDisplayName } from "src/models/User.model";
import AuthToken from "src/models/AuthToken.model";
import Message from "src/models/Message.model";

// Start router
const Routes = Router();

// Add post
Routes.post("/", (req, res) => {
  let { headers, body } = req;

  if (Token.toPerson(headers.authorization)) {
    // Person
    let person = Token.toPerson(headers.authorization);

    // Validate body data
    if (body.message || body.text) {
      // Create message
      let message = {
        user_id: person.user_id,
        text: body.message || body.text
      };

      new Message(message).save((err, post) => {
        if (err) {
          res.status(500).send(
            new Response(
              "ERROR",
              {},
              null,
              new ResponseError(
                500,
                {},
                "Saving error",
                "We've encountered a small problem while saving your post, please try again."
              )
            )
          );
        } else {
          res.send(
            new Response(
              "SUCCESS",
              {
                post: post
              },
              "Message successfully posted!"
            )
          );
        }
      });
    } else {
      res.status(400).send(
        new Response(
          "ERROR",
          {},
          null,
          new ResponseError(
            400,
            {},
            "No message",
            "You just can't post a message without a proper message, can you?"
          )
        )
      );
    }
  } else {
    res.status(401).send(
      new Response(
        "ERROR",
        {},
        null,
        new ResponseError(
          401,
          {},
          "Unauthorized",
          "You don't have permission to post messages."
        )
      )
    );
  }
});

// Update post
Routes.put("/:id", (req, res) => {
  let { headers, body } = req;

  if (Token.toPerson(headers.authorization)) {
    // Validate body data
    if (body.message || body.text) {
      // Create message
      let message = {
        text: body.message || body.text
      };

      Message.update(
        {
          _id: req.params.id
        },
        message,
        {
          multi: false
        },
        (err, post) => {
          console.log(post);
        }
      )
    }
  } else {

  }
  //console.log(req);
  res.send("HI");
});

// No get access to this route
Routes.get("/page/:page", (req, res) => {
  let page = +req.params.page;

  if (!isNaN(page)) {
    Message.count({}, (err, count) => {
      if (count > 0) {
        Message
          .find()
          .limit(10)
          .skip(10 * page - 10)
          .exec({}, (err, post) => {
            res.send(
              new Response(
                "SUCCESS",
                {
                  count: count,
                  members: post
                },
                null
              )
            );
          });
      } else {
        res.send(
          new Response(
            "SUCCESS",
            {
              count: count,
              members: []
            },
            "No messages in the database."
          )
        );
      }
    });
  } else {
    res.send(
      new Response(
        "ERROR",
        {},
        null,
        new ResponseError(
          400,
          {},
          "Invalid requst",
          "That was a bad one, try again."
        )
      )
    );
  }
});

// No get access to this route
Routes.get("/", (req, res) => {
  Message.count({}, (err, count) => {
    if (count > 0) {
      Message.find({}, (err, post) => {
        res.send(
          new Response(
            "SUCCESS",
            {
              count: count,
              members: post
            },
            null
          )
        );
      });
    } else {
      res.send(
        new Response(
          "SUCCESS",
          {
            count: count,
            members: []
          },
          "No messages in the database."
        )
      );
    }
  });
});

// No get access to this route
Routes.use(/^\/(.+)/, (req, res) => {
  res.status(403).send(
    new Response(
      "VOID",
      {},
      null,
      new ResponseError(
        403,
        {},
        "Forbidden",
        "Endpoint either forbidden and/or non-existent."
      )
    )
  );
});

// Export routes object
export default Routes;

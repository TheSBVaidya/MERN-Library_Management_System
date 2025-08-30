const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const e = require("express");
const { createToken, jwtAuth } = require("../utils/jwtauth");
const router = express.Router();

const role = "user";

router.post("/register", (req, resp) => {
  const { name, email, phone, password } = req.body;

  db.query(
    "INSERT INTO members (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
    [name, email, phone, password, role],
    (err, result) => {
      if (err) return resp.status(409).send(apiError(err));
      if (result.affectedRows === 1) {
        db.query(
          "SELECT * FROM members WHERE id = ?",
          [result.insertId],
          (err, result) => {
            if (err)
              return resp.status(403).send(apiError("User not register"));
            resp.send(apiSuccess(result[0]));
          }
        );
      }
    }
  );
});

router.post("/login", (req, resp) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM members WHERE email = ?", [email], (err, result) => {
    if (err) return resp.send(aptError(err));
    if (result.length !== 1) return resp.send(apiError("User Not Found!"));
    const dbUser = result[0];
    const isMatching = password;
    if (isMatching !== dbUser.password)
      return resp.status(401).send(apiError("Invalid Password"));

    //create jwt token and added in resp
    const token = createToken(dbUser);
    resp.send(apiSuccess(dbUser));
    // resp.send(apiSuccess({ ...dbUser, token }));
  });
});

router.get("/getAllBooks", jwtAuth, (req, resp) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return resp.send(apiError(err));
    resp.send(apiSuccess(result));
  });
});

router.patch("/updatePassword/:id", (req, resp) => {
  const { currentPassword, newPassword } = req.body;
  db.query(
    "SELECT password FROM members WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return resp.status(404).send(apiError("user not found"));

      const dbUser = result[0];

      if (dbUser.password !== currentPassword)
        return resp.send(apiError("Password is not matching"));

      db.query(
        "UPDATE members SET password = ? WHERE id = ?",
        [newPassword, req.params.id],
        (err, result) => {
          if (err) return resp.send(apiError(err));
          resp.send(apiSuccess("Password change successfully"));
        }
      );
    }
  );
});

//get available book by Name, author, ISBN, Subject
router.get("/getBookByNAIS", (req, resp) => {
  const { name, author, isbn, subject, price } = req.query;
  let field = null;
  let value = null;

  if (name) {
    field = "b.name";
    value = name + "%";
  } else if (author) {
    field = "b.author";
    value = author + "%";
  } else if (isbn) {
    field = "b.isbn";
    value = isbn + "%";
  } else if (subject) {
    field = "b.subject";
    value = subject + "%";
  } else if (price) {
    field = "b.price";
    value = price + "%";
  }

  const sql = `
    SELECT DISTINCT b.*
    FROM books b
    JOIN copies c ON b.id = c.book_id
    WHERE c.status = 'available' AND ${field} LIKE ?
  `;

  db.query(sql, [value], (err, result) => {
    if (err) return resp.status(404).send(apiError(err));

    resp.send(apiSuccess(result));
  });
});

module.exports = router;

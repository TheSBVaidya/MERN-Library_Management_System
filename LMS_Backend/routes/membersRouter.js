const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, apiError } = require("../utils/apiresult");
const e = require("express");
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
    resp.send(apiSuccess(dbUser));
  });
});

router.get("/getAllBooks", (req, resp) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return resp.send(apiError(err));
    resp.send(apiSuccess(result));
  });
});

module.exports = router;

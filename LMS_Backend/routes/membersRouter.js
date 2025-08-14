const express = require("express");
const db = require("../utils/dbpool");
const { apiSuccess, aptError } = require("../utils/apiresult");
const e = require("express");
const router = express.Router();

router.post("/register", (req, resp) => {
  const { name, email, phone, password } = req.body;

  db.query(
    "INSERT INTO members (name, email, phone, password) VALUES (?, ?, ?, ?)",
    [name, email, phone, password],
    (err, result) => {
      if (err) return resp.send(aptError(err));
      if (result.affectedRows === 1) {
        db.query(
          "SELECT * FROM members WHERE id = ?",
          [result.insertId],
          (err, result) => {
            if (err) return resp.send(aptError("User not register"));
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
    if (result.length !== 1) return resp.send(aptError("User Not Found!"));
    const dbUser = result[0];
    const isMatching = password;
    if (isMatching !== dbUser.password)
      return resp.send(aptError("Invalid Password"));
    resp.send(apiSuccess(dbUser));
  });
});

router.get("/getAllBooks", (req, resp) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return resp.send(aptError(err));
    resp.send(apiSuccess(result));
  });
});

module.exports = router;
